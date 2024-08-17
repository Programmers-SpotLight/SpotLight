import { InternalServerError } from "@/utils/errors";
import { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid';


export const insertHashtagsGetIds = async (
  transaction: Knex.Transaction<any, any[]>,
  hashtags: string[]
) : Promise<number[]> => {
  let hashtagsToInsert: { htag_name: string }[] = [];

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
  const hashtagsToInsert : {htag_name: string}[] = hashtags.map((hashtag) => {
    return {
      htag_name: hashtag
    };
  });

  try {
    await transaction('hashtag')
      .insert(hashtagsToInsert)
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
  const hashtagsToInsert: {
    slt_htag_id: Buffer;
    slt_id: number;
    htag_id: number;
  }[] = hashtags.map((hashtag) => {
    return {
      slt_htag_id: transaction.fn.uuidToBin(uuidv4()),
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

  const hashtagsToInsert : {
    slt_temp_htag_id: Buffer, 
    slt_temp_id: number, 
    htag_id: number
  }[] = hashtags.map((hashtag) => {
    return {
      slt_temp_htag_id: transaction.fn.uuidToBin(uuidv4()),
      slt_temp_id: selectionId,
      htag_id: hashtag
    };
  });

  let queryResult : number[];
  try {
    queryResult = await transaction('selection_temporary_hashtag')
      .insert(hashtagsToInsert, ['slt_temp_id'])
      .onConflict(['slt_temp_id', 'htag_id'])
      .ignore();

    if (queryResult.length === 0) {
      throw new InternalServerError('임시 셀렉션 해시태그 생성에 실패했습니다');
    }
  } catch (error) {
    console.error(error);
    throw new InternalServerError('임시 셀렉션 해시태그 생성에 실패했습니다');
  }
}

export async function insertMultipleSpotHashtag(
  transaction: Knex.Transaction<any, any[]>,
  spotHashtags: Array<{id: string, hashtags: number[]}>
) : Promise<void> {
  let insertData : Array<{
    spot_htag_id: Buffer,
    spot_id: Buffer,
    htag_id: number
  }> = [];

  for (let i = 0; i < spotHashtags.length; i++) {
    spotHashtags[i].hashtags.map((hashtag) => {
      insertData.push({
        spot_htag_id: transaction.fn.uuidToBin(uuidv4()),
        spot_id: transaction.fn.uuidToBin(spotHashtags[i].id),
        htag_id: hashtag
      });
    });
  }

  try {
    await transaction('spot_hashtag')
      .insert(insertData)
      .onConflict(['spot_id', 'htag_id'])
      .ignore();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 해시태그를 생성하는데 실패했습니다');
  }
}

export async function insertMultipleSpotTemporaryHashtag(
  transaction: Knex.Transaction<any, any[]>,
  spotHashtags: Array<{id: string, hashtags: number[]}>
) : Promise<void> {
  let insertData : Array<{
    spot_temp_htag_id: Buffer,
    spot_temp_id: Buffer,
    htag_id: number
  }> = [];

  for (let i = 0; i < spotHashtags.length; i++) {
    spotHashtags[i].hashtags.map((hashtag) => {
      insertData.push({
        spot_temp_htag_id: transaction.fn.uuidToBin(uuidv4()),
        spot_temp_id: transaction.fn.uuidToBin(spotHashtags[i].id),
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
