interface IRecommendationInputData {
  userId: string;
}

export const register = async () => {
  if (process.env.NEXT_RUNTIME != 'nodejs') {
    const { Worker } = await import('bullmq');
    const { connection } = await import('./libs/redis');
    const { 
      recommendationQueue, 
      manualRecommendationQueue 
    } = await import('./libs/queue');
    const {
      selectSelectionHashtagBySelectionPopularity,
      selectAllSelectionHashtag,
      selectAllUserHashtagByUserId
    } = await import('./repositories/hashtag.repository');
    const {
      deleteAllUserSelectionRecommendation,
      insertUserSelectionRecommendation,
      selectAllUserId,
    } = await import('./repositories/user.repository');
    const {
      sortSelectionIdByBookmarkCountDesc,
    } = await import('./repositories/selection.repository');
    const { dbConnectionPool } = await import('./libs/db');


    /*************************************************/
    /* 매 시스템의 모든 유저 대상으로 1시간마다 자동으로 추천을 업데이트하는 큐 */
    /*************************************************/
    const autoRecommendationQueueWorker = new Worker<IRecommendationInputData>('recommendationQueue', async (job) => {
      const userIds = await selectAllUserId();

      for (const userId of userIds) {
        const trx = await dbConnectionPool.transaction();
        try {
          const userHashtagQueryResult = await selectAllUserHashtagByUserId(userId);

          if (userHashtagQueryResult.length === 0) {
            throw new Error('유저가 등록한 최애 해시태그가 없습니다');
          }

          const userHashtags = userHashtagQueryResult.map((row) => row.hashtag).join(' ');

          let popularSelectionHashtagQueryResult : Array<{
            selectionId: number;
            hashtags: string;
          }> = await selectSelectionHashtagBySelectionPopularity(trx, 100, [userId]);

          // 1. 인기 셀렉션 해시태그가 없으면 모든 셀렉션 해시태그를 추천
          // 2. 인기 셀렉션의 기준은 북마크 수가 10개 이상인 셀렉션을 뜻한다. 나중에 변경될 수 있음
          // 3. 없으면 모든 셀렉션 중에서 100개 무작위로 선택 후 추천 진행
          if (popularSelectionHashtagQueryResult.length === 0) {
            const selectionHashtagQueryResult = await selectAllSelectionHashtag(
              trx,
              100,
              [userId]
            );
            if (selectionHashtagQueryResult.length === 0) {
              throw new Error('현재 추천할 수 있는 셀렉션이 없습니다');
            }

            const selectionHashtagSelectionIds = selectionHashtagQueryResult.map((row) => row.selectionId);
            const selectionIdSortedByBookmarkCount = await sortSelectionIdByBookmarkCountDesc(
              trx,
              selectionHashtagSelectionIds
            );

            popularSelectionHashtagQueryResult = selectionIdSortedByBookmarkCount.map((selectionBookmarkCountRow) => {
              const selectionHashtags = selectionHashtagQueryResult.find(
                (row) => row.selectionId === selectionBookmarkCountRow.selectionId
              )?.hashtags || '';

              if (!selectionHashtags) {
                return null;
              }

              return {
                selectionId: selectionBookmarkCountRow.selectionId,
                hashtags: selectionHashtags,
              };
            }).filter((row) => row !== null);
          } 

          const data : string[] = [
            userHashtags,
            ...popularSelectionHashtagQueryResult.map((row) => row.hashtags)
          ];

          const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const responseJson : {category: Array<number[]>} = (await response.json());
          if (!responseJson.category) {
            throw new Error('AI 서버에서 응답을 받지 못했습니다');
          }

          // AI 서버에서 응답을 받은 후 추천 점수를 추출
          const result : number[] = responseJson.category[0];
          result.shift();

          // 추천 점수가 높은 순으로 20개 추출
          const selectionIdAndScore = popularSelectionHashtagQueryResult.map((row, index) => {
            return {
              selectionId: row.selectionId,
              score: result[index],
            };
          }).sort((a, b) => b.score - a.score).slice(0, 20);

          await deleteAllUserSelectionRecommendation(trx, userId);
          await insertUserSelectionRecommendation(
            trx,
            userId,
            selectionIdAndScore.map((row) => row.selectionId)
          );

          await trx.commit();
          return job.data;
        } catch (error) {
          console.error(error);
          await trx.rollback();
          continue;
        }
      }
    }, {
      connection,
      concurrency: 1,
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    });

    autoRecommendationQueueWorker.on("completed", async (job) => {
        console.log(`Job completed for ${job.id}`);
    });
    autoRecommendationQueueWorker.on("failed", async (job, err) => {
        console.error(`${job?.id} has failed with ${err.message}`);
    });
    autoRecommendationQueueWorker.on("stalled", (str) => {
        console.log(`Job stalled: ${str}`);
    });


    /*************************************************/
    /* 사용자 최애 해시태그 갱신 시 수동으로 추천을 업데이트하는 큐 */
    /*************************************************/
    const manualRecommendationQueueWorker = new Worker<IRecommendationInputData>('manualRecommendationQueue', async (job) => {
      const userId = Number(job.data.userId);
      if (isNaN(userId)) {
        throw new Error('Invalid userId');
      }

      const trx = await dbConnectionPool.transaction();
      try {
        const userHashtagQueryResult = await trx('user_hashtag')
          .select([
            'hashtag.htag_name as hashtag',
          ])
          .leftJoin('hashtag', 'user_hashtag.htag_id', 'hashtag.htag_id')
          .where('user_hashtag.user_id', String(userId));

        if (userHashtagQueryResult.length === 0) {
          throw new Error('유저가 등록한 최애 해시태그가 없습니다');
        }

        const userHashtags = userHashtagQueryResult.map((row) => row.hashtag).join(' ');

        let popularSelectionHashtagQueryResult : Array<{
          selectionId: number;
          hashtags: string;
        }> = await selectSelectionHashtagBySelectionPopularity(trx, 100, [userId]);

        // 1. 인기 셀렉션 해시태그가 없으면 모든 셀렉션 해시태그를 추천.
        // 2. 인기 셀렉션의 기준은 북마크 수가 10개 이상인 셀렉션을 뜻한다. 나중에 변경될 수 있음.
        // 3. 없으면 모든 셀렉션 중에서 100개 무작위로 선택 후 추천 진행
        if (popularSelectionHashtagQueryResult.length === 0) {
          const selectionHashtagQueryResult = await selectAllSelectionHashtag(
            trx,
            100,
            [userId]
          );
          if (selectionHashtagQueryResult.length === 0) {
            throw new Error('현재 추천할 수 있는 셀렉션이 없습니다');
          }

          const selectionHashtagSelectionIds = selectionHashtagQueryResult.map((row) => row.selectionId);
          const selectionIdSortedByBookmarkCount = await sortSelectionIdByBookmarkCountDesc(
            trx,
            selectionHashtagSelectionIds
          );

          popularSelectionHashtagQueryResult = selectionIdSortedByBookmarkCount.map((selectionBookmarkCountRow) => {
            const selectionHashtags = selectionHashtagQueryResult.find(
              (row) => row.selectionId === selectionBookmarkCountRow.selectionId
            )?.hashtags || '';

            if (!selectionHashtags) {
              return null;
            }

            return {
              selectionId: selectionBookmarkCountRow.selectionId,
              hashtags: selectionHashtags,
            };
          }).filter((row) => row !== null);
        } 

        const data : string[] = [
          userHashtags,
          ...popularSelectionHashtagQueryResult.map((row) => row.hashtags)
        ];

        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const responseJson : {category: Array<number[]>} = (await response.json());
        if (!responseJson.category) {
          throw new Error('AI 서버에서 응답을 받지 못했습니다');
        }
        const result : number[] = responseJson.category[0];
        result.shift();

        // 추천 점수가 높은 순으로 20개 추출
        const selectionIdAndScore = popularSelectionHashtagQueryResult.map((row, index) => {
          return {
            selectionId: row.selectionId,
            score: result[index],
          };
        }).sort((a, b) => b.score - a.score).slice(0, 20);

        await deleteAllUserSelectionRecommendation(trx, userId);
        await insertUserSelectionRecommendation(
          trx,
          userId,
          selectionIdAndScore.map((row) => row.selectionId)
        );

        await trx.commit();
        return job.data;
      } catch (error) {
        console.error(error);
        await trx.rollback();
        throw new Error('Failed to process the job');
      }
    }, {
      connection,
      concurrency: 1,
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    });

    manualRecommendationQueueWorker.on("completed", async (job) => {
      console.log(`Job completed for ${job.id}`);
    });

    manualRecommendationQueueWorker.on("failed", async (job, err) => {
      console.error(`${job?.id} has failed with ${err.message}`);
    });

    manualRecommendationQueueWorker.on("stalled", (str) => {
      console.log(`Job stalled: ${str}`);
    });

    /* 한 시간마다 추천 업데이트 */
    await recommendationQueue.add('recommendationQueue', { userId: '1' }, {
      repeat:{
        every: 3600000
      }
    });
  }
};