import { dbConnectionPool } from "@/libs/db";
import { InternalServerError } from "@/utils/errors";
import { Knex } from "knex";


interface IInsertHashtag {
  htag_name: string;
}

interface IInsertSelectionHashtag {
  slt_htag_id: Knex.Raw<any>;
  slt_id: number;
  htag_id: number;
}

interface IInsertTemporarySelectionHashtag {
  slt_temp_htag_id: Knex.Raw<any>;
  slt_temp_id: number;
  htag_id: number;
}

interface IInsertSpotHashtag {
  spot_htag_id: Knex.Raw<any>;
  spot_id: Knex.Raw<any>;
  htag_id: number;
}

interface IInsertTemporarySpotHashtag {
  spot_temp_htag_id: Knex.Raw<any>;
  spot_temp_id: Knex.Raw<any>;
  htag_id: number;
}

interface ISelectSelectionHashtag {
  name: string;
}

export const insertHashtagsGetIds = async (
  transaction: Knex.Transaction<any, any[]>,
  hashtags: string[]
) : Promise<number[]> => {
  let hashtagsToInsert: IInsertHashtag[] = [];

  hashtags.map((hashtag) => {
    hashtagsToInsert.push({
      htag_name: hashtag
    });
  });

  try {
    await transaction('hashtag')
      .insert(hashtagsToInsert)
      .onConflict('htag_name')
      .merge();

    const querySelectResult = await transaction("hashtag")
      .select("htag_id")
      .whereIn("htag_name", hashtags);

    return querySelectResult.map((row) => row.htag_id);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('해시태그를 생성하는데 실패했습니다');
  }
}

export const insertHashtagsGetIdsNames = async (
  transaction: Knex.Transaction<any, any[]>,
  hashtags: string[]
) : Promise<{ htag_id: number, htag_name: string }[]> => {
  const hashtagsToInsert : IInsertHashtag[] = hashtags.map((hashtag) => {
    return {
      htag_name: hashtag
    };
  });

  try {
    const insertQueryResult = await transaction('hashtag')
      .insert(hashtagsToInsert, ['htag_id', 'htag_name'])
      .onConflict('htag_name')
      .merge();

    const querySelectResult = await transaction("hashtag")
      .select("htag_id", "htag_name")
      .whereIn("htag_name", hashtags);

    return querySelectResult;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('해시태그를 생성하는데 실패했습니다');
  }
}

export async function insertSelectionHashtags(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  hashtags: number[]
): Promise<void> {
  const hashtagsToInsert: IInsertSelectionHashtag[] = hashtags.map((hashtag) => {
    return {
      slt_htag_id: transaction.raw('UUID_TO_BIN(UUID())'),
      slt_id: selectionId,
      htag_id: hashtag
    };
  });

  try {
    await transaction("selection_hashtag")
      .insert(hashtagsToInsert)
      .onConflict(["slt_id", "htag_id"])
      .ignore();
  } catch (error) {
    console.error(error);
    throw new InternalServerError("셀렉션 해시태그 생성에 실패했습니다");
  }
}

export async function insertTemporarySelectionHashtags(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  hashtags: number[]
) : Promise<void> {

  const hashtagsToInsert : IInsertTemporarySelectionHashtag[] = hashtags.map((hashtag) => {
    return {
      slt_temp_htag_id: transaction.raw('UUID_TO_BIN(UUID())'),
      slt_temp_id: selectionId,
      htag_id: hashtag
    };
  });

  try {
    await transaction('selection_temporary_hashtag')
      .insert(hashtagsToInsert, ['slt_temp_id'])
      .onConflict(['slt_temp_id', 'htag_id'])
      .ignore();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('임시 셀렉션 해시태그 생성에 실패했습니다');
  }
}

export async function insertMultipleSpotHashtag(
  transaction: Knex.Transaction<any, any[]>,
  spotHashtags: Array<{id: string, hashtags: number[]}>
) : Promise<void> {
  let insertData : Array<IInsertSpotHashtag> = [];
  for (let i = 0; i < spotHashtags.length; i++) {
    spotHashtags[i].hashtags.map((hashtag) => {
      insertData.push({
        spot_htag_id: transaction.raw('UUID_TO_BIN(UUID())'),
        spot_id: transaction.raw('UNHEX(?)', [spotHashtags[i].id]),
        htag_id: hashtag
      });
    });
  }

  try {
    await transaction('spot_hashtag')
      .insert(insertData, ['htag_id'])
      .onConflict(['spot_id', 'htag_id'])
      .merge();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 해시태그를 생성하는데 실패했습니다');
  }
}

export async function insertMultipleSpotTemporaryHashtag(
  transaction: Knex.Transaction<any, any[]>,
  spotHashtags: Array<{id: string, hashtags: number[]}>
) : Promise<void> {
  let insertData : Array<IInsertTemporarySpotHashtag> = [];

  for (let i = 0; i < spotHashtags.length; i++) {
    spotHashtags[i].hashtags.map((hashtag) => {
      insertData.push({
        spot_temp_htag_id: transaction.raw('UUID_TO_BIN(UUID())'),
        spot_temp_id: transaction.raw('UNHEX(?)', [spotHashtags[i].id]),
        htag_id: hashtag
      });
    });
  }

  try {
    await transaction('spot_temporary_hashtag')
      .insert(insertData)
      .onConflict(['spot_temp_id', 'htag_id'])
      .ignore();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 해시태그를 생성하는데 실패했습니다');
  }
}

export async function selectMultipleSelectionHashtags(
  selectionId: number
) : Promise<ISelectSelectionHashtag[]> {
  try {
    const queryResult = await dbConnectionPool('selection_hashtag')
      .column([
        'hashtag.htag_name as name'
      ])
      .select()
      .leftJoin('hashtag', 'selection_hashtag.htag_id', 'hashtag.htag_id')
      .where('selection_hashtag.slt_id', selectionId);

    return queryResult;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('셀렉션 해시태그를 가져오는데 실패했습니다');
  }
}

export async function selectMultipleTemporarySelectionHashtags(
  selectionId: number
) : Promise<ISelectSelectionHashtag[]> {
  try {
    const queryResult = await dbConnectionPool('selection_temporary_hashtag')
      .column([
        'hashtag.htag_name as name'
      ])
      .select()
      .leftJoin('hashtag', 'selection_temporary_hashtag.htag_id', 'hashtag.htag_id')
      .where('selection_temporary_hashtag.slt_temp_id', selectionId);

    return queryResult;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('임시 셀렉션 해시태그를 가져오는데 실패했습니다');
  }
}

export async function selectMultipleSpotHashtagBySelectionId(
  selectionId: number
) : Promise<Array<{ spotId: string, name: string }>> {
  try {
    return await dbConnectionPool('spot_hashtag')
      .select([
        dbConnectionPool.raw('BIN_TO_UUID(spot_hashtag.spot_id) as spotId'),
        'hashtag.htag_name as name'
      ])
      .leftJoin('hashtag', 'spot_hashtag.htag_id', 'hashtag.htag_id')
      .whereRaw('spot_hashtag.spot_id IN (SELECT spot_id FROM spot WHERE slt_id = ?)', [selectionId])
      .orderBy('hashtag.htag_name', 'asc');

  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 해시태그를 가져오는데 실패했습니다');
  }
}

export async function selectMultipleSpotTemporaryHashtagBySelectionId(
  selectionId: number
) : Promise<Array<{ spotId: string, name: string }>> {
  try {
    const queryResult = await dbConnectionPool.raw(`
      SELECT 
        BIN_TO_UUID(spot_temporary_hashtag.spot_temp_id) as spotId, 
        hashtag.htag_name as name
      FROM spot_temporary_hashtag
      JOIN hashtag ON spot_temporary_hashtag.htag_id = hashtag.htag_id
      WHERE spot_temporary_hashtag.spot_temp_id IN (
        SELECT spot_temp_id 
        FROM spot_temporary 
        WHERE slt_temp_id = ?
      )
      ORDER BY hashtag.htag_name ASC
    `, [selectionId]);

    return queryResult[0];
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 해시태그를 가져오는데 실패했습니다');
  }
}

export async function deleteMultipleSelectionHashtagNotIn(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  hashtags: number[]
) : Promise<void> {
  try {
    await transaction('selection_hashtag')
      .where('slt_id', selectionId)
      .whereNotIn('htag_id', hashtags)
      .delete();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('셀렉션 해시태그를 삭제하는데 실패했습니다');
  }
}

export async function deleteAllTemporarySelectionHashtagBySelectionId(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number
) {
  try {
    await transaction('selection_temporary_hashtag')
      .where('slt_temp_id', selectionId)
      .delete();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('임시 셀렉션 해시태그를 삭제하는데 실패했습니다');
  }
}

export async function deleteMultipleTemporarySelectionHashtagNotIn(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  hashtags: number[]
) : Promise<void> {
  try {
    await transaction('selection_temporary_hashtag')
      .where('slt_temp_id', selectionId)
      .whereNotIn('htag_id', hashtags)
      .delete();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('임시 셀렉션 해시태그를 삭제하는데 실패했습니다');
  }
}

export async function deleteMultipleSpotHashtagNotIn(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  hashtags: number[]
) : Promise<void> {
  try {
    const deleted = await transaction('spot_hashtag')
      .whereNotIn('htag_id', hashtags)
      .andWhereRaw('spot_id IN (SELECT spot_id FROM spot WHERE slt_id = ?)', [selectionId])
      .delete();

    if (deleted > 0) {
      console.log('Deleted spot hashtags:', deleted);
    }
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 해시태그를 삭제하는데 실패했습니다');
  }
}

export async function deleteMultipleSpotTemporaryHashtagNotIn(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  hashtags: number[]
) : Promise<void> {
  try {
    const deleted = await transaction('spot_temporary_hashtag')
      .whereNotIn('htag_id', hashtags)
      .andWhereRaw('spot_temp_id IN (SELECT spot_temp_id FROM spot_temporary WHERE slt_temp_id = ?)', [selectionId])
      .delete();

    if (deleted > 0) {
      console.log('Deleted spot temporary hashtags:', deleted);
    }
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 해시태그를 삭제하는데 실패했습니다');
  }
}