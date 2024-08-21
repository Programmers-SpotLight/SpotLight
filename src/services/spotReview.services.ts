import { dbConnectionPool } from "@/libs/db";

interface ISpotReviews {
  sltOrSpotId: string;
  sort: string;
  page: number;
  userId: number;
}

export async function getSpotReviews({
  sltOrSpotId,
  sort,
  page,
  userId
}: ISpotReviews) {
  const maxResults = 5;
  const offset = maxResults * (page - 1);

  const orderByClause = sort === 'like'
    ? [
        { column: 'likeCount', order: 'desc' },
        { column: 'spot_review_created_date', order: 'desc' }
      ]
    : [
        { column: 'spot_review_created_date', order: 'desc' }
      ];
      
  const selectColumns = [
    dbConnectionPool.raw('HEX(r.spot_review_id) AS reviewId'),
    'r.spot_id AS sltOrSpotId',
    'r.spot_review_description AS reviewDescription',
    'r.spot_review_score AS reviewScore',
    dbConnectionPool.raw('DATE_FORMAT(r.spot_review_created_date, "%Y-%m-%d") AS createdDate'),
    dbConnectionPool.raw('DATE_FORMAT(r.spot_review_updated_date, "%Y-%m-%d") AS updatedDate'),
    'u.user_id AS userId',
    'u.user_nickname AS userNickname',
    'u.user_img AS userImage',
    dbConnectionPool.raw(`
      GROUP_CONCAT(
        CONCAT(
          '{"reviewImgId":"', HEX(i.spot_review_img_id), 
          '","reviewImgSrc":"', REPLACE(i.spot_review_img_url, '"', '\"'), 
          '","reviewImageOrder":', i.spot_review_img_order, '}'
        ) ORDER BY i.spot_review_img_order SEPARATOR ','
      ) AS reviewImg
    `),
    dbConnectionPool.raw(`
      (SELECT COUNT(*) FROM spotlight.spot_review_like l 
        WHERE HEX(l.spot_review_id) = HEX(r.spot_review_id)) AS likeCount
    `)
  ];

  if (userId) {
    selectColumns.push(
      dbConnectionPool.raw(`
        (SELECT COUNT(*) FROM spotlight.spot_review_like l 
          WHERE HEX(l.spot_review_id) = HEX(r.spot_review_id) AND l.user_id = ?) > 0 AS isLiked
      `, [userId])
    );
  }

  const queryResult = await dbConnectionPool
    .select(selectColumns)
    .from('spotlight.spot_review AS r')
    .leftJoin('spotlight.user AS u', 'r.user_id', 'u.user_id')
    .leftJoin('spotlight.spot_review_image AS i', 'r.spot_review_id', 'i.spot_review_id')
    .whereRaw('r.spot_id = UNHEX(?)', [sltOrSpotId])
    .groupBy('r.spot_review_id', 'r.spot_id', 'r.spot_review_description', 'r.spot_review_score', 'r.spot_review_created_date', 'u.user_id', 'u.user_nickname', 'u.user_img')
    .orderBy(orderByClause)
    .offset(offset)  
    .limit(maxResults); 

  const reviews = queryResult.map(review => ({
    reviewId: review.reviewId,
    sltOrSpotId: review.sltOrSpotId,
    reviewDescription: review.reviewDescription,
    reviewScore: review.reviewScore,
    createdDate: review.createdDate,
    updatedDate: review.updatedDate,
    user: {
      userId: review.userId,
      userNickname: review.userNickname,
      userImage: review.userImage,
      isLiked: userId ? review.isLiked : null
    },
    reviewImg: review.reviewImg ? JSON.parse(`[${review.reviewImg}]`) : null,
    likeCount: review.likeCount
  }));

  return reviews;
}

export async function postSpotReviews(review: IReviewInsertData) {
  try {
    await dbConnectionPool.transaction(async (trx) => {
      await trx('spot_review').insert({
        spot_review_id: review.reviewId,
        user_id: review.userId,
        spot_id: trx.raw('UNHEX(?)', [review.sltOrSpotId]),
        spot_review_description: review.reviewDescription,
        spot_review_score: review.reviewScore,
      });

      if (review.reviewImg && review.reviewImg.length > 0) {
        const reviewImage = review.reviewImg.map((img) => ({
          spot_review_img_id: img.reviewImgId,
          spot_review_id: review.reviewId,
          spot_reivew_img_url: img.reviewImgSrc,
          spot_review_img_order: img.reviewImageOrder,
        }));

        await trx('spot_review_image').insert(reviewImage);
      }
    });
  } catch (error) {
    console.error("Error inserting review:", error);
    throw new Error('Failed to post Spot review');
  }
}

export async function putSpotReviews(review: IReviewInsertData) {
  try {
    await dbConnectionPool.transaction(async (trx) => {
      const [unhexReviewIdResult] = await trx.raw('SELECT UNHEX(?) AS unhexId', [review.reviewId]);
      const unhexReviewId = unhexReviewIdResult.unhexId;

      await trx('spot_review')
        .whereRaw('spot_review_id = UNHEX(?)', [review.reviewId])
        .update({
          spot_review_description: review.reviewDescription,
          spot_review_score: review.reviewScore,
        });

      await trx('spot_review_image')
        .whereRaw('spot_review_id = UNHEX(?)', [review.reviewId])
        .del();

      if (review.reviewImg && review.reviewImg.length > 0) {
        const reviewImage = review.reviewImg.map((img) => ({
          spot_review_img_id: img.reviewImgId,
          spot_review_id: unhexReviewId, 
          spot_review_img_url: img.reviewImgSrc,
          spot_review_img_order: img.reviewImageOrder,
        }));

        await trx('spot_review_image').insert(reviewImage);
      }
    });
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error('Failed to update spot review');
  }
}


export async function deleteSpotReviews(reviewId: string) {
  try {
    await dbConnectionPool.transaction(async (trx) => {
      await trx('spot_review_image')
        .whereRaw('spot_review_id = UNHEX(?)', [reviewId])
        .del();

      await trx('spot_review')
        .whereRaw('spot_review_id = UNHEX(?)', [reviewId])
        .del();
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error('Failed to delete spot review');
  }
}

