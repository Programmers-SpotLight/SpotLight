import 'server-only';
import { dbConnectionPool } from "@/libs/db";
import { 
  IInsertSpot, 
  IInsertSpotImage, 
  IInsertSpotTemporary, 
  IInsertSpotTemporaryImage, 
  ISelectSpot, 
  ISelectSpotImage 
} from "@/models/spot.model";
import { InternalServerError } from "@/utils/errors";
import { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid';


export const insertMultipleSpotTemporary = async (
  transaction: Knex.Transaction<any, any[]>,
  spots: IInsertSpotTemporary[]
) : Promise<void> => {
  try {
    await transaction('spot_temporary')
      .insert(spots);
  } catch (error : any) {
    console.log(error);
    throw new InternalServerError('임시 스팟 생성에 실패했습니다');
  }
}

export const insertMultipleSpot = async (
  transaction: Knex.Transaction<any, any[]>,
  spots: IInsertSpot[]
) : Promise<void> => {
  try {
    await transaction('spot')
      .insert(spots);
  } catch (error : any) {
    throw new InternalServerError('스팟 생성에 실패했습니다');
  }
};

export async function insertMultipleSpotImage(
  transaction: Knex.Transaction<any, any[]>,
  spotImages: Array<{id: string, images: Array<string>}>
) : Promise<void> {

  let insertData : Array<IInsertSpotImage> = [];

  for (let i = 0; i < spotImages.length; i++) {
    spotImages[i].images.map((image, index) => {
      insertData.push({
        spot_img_id: transaction.fn.uuidToBin(uuidv4()),
        spot_id: transaction.raw('UNHEX(?)', spotImages[i].id),
        spot_img_url: image,
        spot_img_order: index+1
      });
    });
  }

  try {
    await transaction('spot_image')
      .insert(insertData)
      .onConflict(['spot_id', 'spot_photo_url'])
      .merge();
  } catch (error) {
    throw new InternalServerError('스팟 이미지를 생성하는데 실패했습니다');
  }
}

export async function insertMultipleSpotTemporaryImage(
  transaction: Knex.Transaction<any, any[]>,
  spotImages: Array<{id: string, images: Array<string>}>
) : Promise<void> {

  let insertData : Array<IInsertSpotTemporaryImage> = [];

  for (let i = 0; i < spotImages.length; i++) {
    spotImages[i].images.map((image, index) => {
      insertData.push({
        spot_temp_img_id: transaction.fn.uuidToBin(uuidv4()),
        spot_temp_id: transaction.raw('UNHEX(?)', spotImages[i].id),
        spot_temp_img_url: image,
        spot_temp_img_order: index+1
      });
    });
  }

  try {
    await transaction('spot_temporary_image')
      .insert(insertData)
      .onConflict(['spot_temp_id', 'spot_temp_img_url'])
      .ignore();
  } catch (error) {
    throw new InternalServerError('스팟 이미지를 생성하는데 실패했습니다');
  }
}

/**
 * #### 반환된 spot_id는 UUID로 변환된 후 하이픈(-)이 제거된 문자열
 * #### EX) 550e8400e29b41d4a716446655440000
 * @param selectionId - 셀렉션 고유 ID
 * @param spotPlaceIds - spot_gmap_id의 배열
 * @returns Promise<Array<{spot_id: string, spot_gmap_id: string}>>
 */
export async function selectMultipleSpotByInPlaceId(
  selectionId: number,
  spotPlaceIds: string[]
) : Promise<Array<{spot_id: string, spot_gmap_id: string}>> {
  return await dbConnectionPool('spot')
    .select([
      dbConnectionPool.raw('HEX(spot_id) as spot_id'),
      'spot_gmap_id'
    ])
    .whereIn('spot_gmap_id', spotPlaceIds)
    .andWhere('slt_id', selectionId);
}

export async function selectMultipleSpotTemporaryByInPlaceId(
  selectionId: number,
  spotPlaceIds: string[]
) : Promise<Array<{spot_temp_id: string, spot_temp_gmap_id: string}>> {
  return await dbConnectionPool('spot_temporary')
    .select([
      dbConnectionPool.raw('HEX(spot_temp_id) as spot_temp_id'),
      'spot_temp_gmap_id'
    ])
    .whereIn('spot_temp_gmap_id', spotPlaceIds)
    .andWhere('slt_temp_id', selectionId);
}

export async function selectMultipleSpotBySelectionId(
  selectionId: number
): Promise<Array<ISelectSpot>> {
  try {
    const queryResult = await dbConnectionPool('spot')
      .column([
        dbConnectionPool.raw('BIN_TO_UUID(spot_id) as id'),
        'slt_id as selectionId',
        'spot_order as order',
        'spot_title as title',
        'spot_description as description',
        'spot_category_id as categoryId',
        'spot_gmap_id as gmapId',
        'spot_gmap_address as gmapAddress',
        'spot_gmap_latitude as gmapLatitude',
        'spot_gmap_longitude as gmapLongitude'
      ])
      .select()
      .where('slt_id', selectionId)
      .orderBy('spot_order', 'asc');

    return queryResult.map((row) => {
      return {
        images: [],
        hashtags: [],
        ...row
      }
    });
  } catch (error) {
    throw new InternalServerError('스팟을 가져오는데 실패했습니다');
  }
}

export async function selectMultipleSpotTemporaryBySelectionId(
  selectionId: number
): Promise<Array<ISelectSpot>> {
  try {
    const queryResult = await dbConnectionPool('spot_temporary')
      .select([
        dbConnectionPool.raw('BIN_TO_UUID(spot_temp_id) as id'),
        'slt_temp_id as selectionId',
        'spot_temp_order as order',
        'spot_temp_title as title',
        'spot_temp_description as description',
        'spot_category_id as categoryId',
        'spot_temp_gmap_id as gmapId',
        'spot_temp_gmap_address as gmapAddress',
        'spot_temp_gmap_latitude as gmapLatitude',
        'spot_temp_gmap_longitude as gmapLongitude'
      ])
      .where('slt_temp_id', selectionId)
      .orderBy('spot_temp_order', 'asc');

    return queryResult.map((row) => {
      return {
        images: [],
        hashtags: [],
        ...row
      }
    });
  } catch (error) {
    throw new InternalServerError('스팟을 가져오는데 실패했습니다');
  }
}

export async function selectMultipleSpotImageBySpotId(
  spotId: string
): Promise<Array<ISelectSpotImage>> {
  try {
    const queryResult = await dbConnectionPool('spot_image')
      .select('spot_img_id', 'spot_img_url')
      .where('spot_id', dbConnectionPool.fn.uuidToBin(spotId))
      .orderBy('spot_img_order', 'asc');

    return queryResult.map((row) => {
      return {
        spotId: dbConnectionPool.fn.binToUuid(row.spot_img_id),
        imageUrl: row.spot_img_url
      }
    });
  } catch (error) {
    throw new InternalServerError('스팟 이미지를 가져오는데 실패했습니다');
  }
}

export async function selectMultipleSpotTemporaryImageBySpotId(
  spotId: string
): Promise<Array<ISelectSpotImage>> {
  try {
    const queryResult = await dbConnectionPool('spot_temporary_image')
      .select('spot_temp_img_id', 'spot_temp_img_url')
      .where('spot_temp_id', dbConnectionPool.fn.uuidToBin(spotId))
      .orderBy('spot_temp_img_order', 'asc');

    return queryResult.map((row) => {
      return {
        spotId: dbConnectionPool.fn.binToUuid(row.spot_temp_img_id),
        imageUrl: row.spot_temp_img_url
      };
    });
  } catch (error) {
    throw new InternalServerError('스팟 이미지를 가져오는데 실패했습니다');
  }
}

export async function selectMultipleSpotImageBySelectionId(
  selectionId: number
) : Promise<Array<ISelectSpotImage>> {
  const queryResult = await dbConnectionPool('spot_image')
    .select([
      dbConnectionPool.raw('BIN_TO_UUID(spot_id) as spot_id'),
      'spot_img_url'
    ])
    .whereRaw('spot_id IN (SELECT spot_id FROM spot WHERE slt_id = ?)', [selectionId])
    .orderBy('spot_img_order', 'asc');
  
  return queryResult.map((row) => {
    return {
      spotId: row.spot_id,
      imageUrl: row.spot_img_url
    };
  });
}

export async function selectMultipleSpotTemporaryImageBySelectionId(
  selectionId: number
) : Promise<Array<ISelectSpotImage>> {
  const queryResult = await dbConnectionPool.raw(`
    SELECT 
      BIN_TO_UUID(spot_temporary_image.spot_temp_id) as spotId, 
      spot_temporary_image.spot_temp_img_url as imageUrl
    FROM spot_temporary_image
    WHERE spot_temporary_image.spot_temp_id IN (
      SELECT spot_temporary.spot_temp_id
      FROM spot_temporary
      WHERE spot_temporary.slt_temp_id = ?
    )
    ORDER BY spot_temporary_image.spot_temp_img_order ASC  
  `, [selectionId]);

  return queryResult[0];
}

export async function updateMultipleSpotTemporary(
  transaction: Knex.Transaction<any, any[]>,
  spots: IInsertSpotTemporary[]
) : Promise<void> {
  try {
    for (let i = 0; i < spots.length; i++) {
      const updated = await transaction('spot_temporary')
        .whereRaw('spot_temp_gmap_id = ?', [spots[i].spot_temp_gmap_id])
        .update({
          spot_temp_order: spots[i].spot_temp_order,
          spot_category_id: spots[i].spot_category_id,
          spot_temp_title: spots[i].spot_temp_title,
          spot_temp_description: spots[i].spot_temp_description,
          spot_temp_gmap_id: spots[i].spot_temp_gmap_id,
          spot_temp_gmap_address: spots[i].spot_temp_gmap_address,
          spot_temp_gmap_latitude: spots[i].spot_temp_gmap_latitude,
          spot_temp_gmap_longitude: spots[i].spot_temp_gmap_longitude
        });
        
      if (updated === 0) {
        throw new InternalServerError('스팟 수정에 실패했습니다');
      }
    }
  } catch (error) {
    throw new InternalServerError('스팟 수정에 실패했습니다');
  }
}

export async function updateMultipleSpot(
  transaction: Knex.Transaction<any, any[]>,
  spots: IInsertSpot[]
) : Promise<void> {
  try {
    for (let i = 0; i < spots.length; i++) {
      const updated = await transaction('spot')
        .whereRaw('spot_gmap_id = ?', [spots[i].spot_gmap_id])
        .update({
          spot_order: spots[i].spot_order,
          spot_category_id: spots[i].spot_category_id,
          spot_title: spots[i].spot_title,
          spot_description: spots[i].spot_description,
          spot_gmap_id: spots[i].spot_gmap_id,
          spot_gmap_address: spots[i].spot_gmap_address,
          spot_gmap_latitude: spots[i].spot_gmap_latitude,
          spot_gmap_longitude: spots[i].spot_gmap_longitude
        });
        
      if (updated === 0) {
        throw new InternalServerError('스팟 수정에 실패했습니다');
      }
    }
  } catch (error) {
    throw new InternalServerError('스팟 수정에 실패했습니다');
  }
}

export async function deleteAllSpotBySelectionId(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number
) : Promise<void> {
  try {
    await transaction('spot')
      .where('slt_id', selectionId)
      .delete();
  } catch (error) {
    throw new InternalServerError('스팟 삭제에 실패했습니다');
  }
}

export async function deleteAllSpotTemporaryBySelectionId(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number
) : Promise<void> {
  try {
    await transaction('spot_temporary')
      .where('slt_temp_id', selectionId)
      .delete();
  } catch (error) {
    throw new InternalServerError('스팟 삭제에 실패했습니다');
  }
}

export async function deleteMultipleSpotBySelectionIdAndNotInPlaceId(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  placeIds: string[]
) : Promise<void> {
  try {
    await transaction.raw(`
      DELETE FROM spot
      WHERE spot_gmap_id NOT IN (${placeIds.map(() => '?').join(',')})
      AND slt_id = ?
    `, [...placeIds, selectionId]);
  } catch (error) {
    throw new InternalServerError('스팟 삭제에 실패했습니다');
  }
}

export async function deleteMultipleSpotTemporaryBySelectionIdAndNotInPlaceId(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  placeIds: string[]
) : Promise<void> {
  try {
    await transaction.raw(`
      DELETE FROM spot_temporary
      WHERE spot_temp_gmap_id NOT IN (${placeIds.map(() => '?').join(',')})
      AND slt_temp_id = ?
    `, [...placeIds, selectionId]);
  } catch (error) {
    throw new InternalServerError('스팟 삭제에 실패했습니다');
  }
}

export async function deleteAllSpotImageBySelectionId(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number
) : Promise<void> {
  try {
    await transaction('spot_image')
      .whereRaw('spot_id IN (SELECT spot_id FROM spot WHERE slt_id = ?)', [selectionId])
      .delete();
  } catch (error) {
    throw new InternalServerError('스팟 이미지 삭제에 실패했습니다');
  }
}

export async function deleteAllSpotTemporaryImageBySelectionId(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number
) : Promise<void> {
  try {
    await transaction('spot_temporary_image')
      .whereRaw('spot_temp_id IN (SELECT spot_temp_id FROM spot_temporary WHERE slt_temp_id = ?)', [selectionId])
      .delete();
  } catch (error) {
    throw new InternalServerError('스팟 이미지 삭제에 실패했습니다');
  }
}

export async function deleteMultipleSpotImageBySelectionIdAndNotInImageUrl(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  imageUrls: string[]
) : Promise<void> {
  try {
    await transaction.raw(`
      DELETE FROM spot_image
      WHERE spot_img_url NOT IN (${imageUrls.map(() => '?').join(',')})
      AND spot_id IN (
        SELECT spot_id
        FROM spot
        WHERE slt_id = ?
      )
    `, [...imageUrls, selectionId]);
  } catch (error) {
    throw new InternalServerError('스팟 이미지 삭제에 실패했습니다');
  }
}

export async function deleteMultipleSpotTemporaryImageBySelectionIdAndNotInImageUrl(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  imageUrls: string[]
) : Promise<void> {
  try {
    await transaction.raw(`
      DELETE FROM spot_temporary_image
      WHERE spot_temp_img_url NOT IN (${imageUrls.map(() => '?').join(',')})
      AND spot_temp_id IN (
        SELECT spot_temp_id
        FROM spot_temporary
        WHERE slt_temp_id = ?
      )
    `, [...imageUrls, selectionId]);
  } catch (error) {
    throw new InternalServerError('스팟 이미지 삭제에 실패했습니다');
  }
}