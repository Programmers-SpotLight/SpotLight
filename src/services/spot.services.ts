'use server';

import { dbConnectionPool } from "@/libs/db";
import { ISelectionSpot, ISelectionSpotCategory } from "@/models/selection.model";
import { InternalServerError } from "@/utils/errors";
import { createDirectory, saveFile } from "@/utils/fileStorage";
import { fileTypeFromBlob, FileTypeResult } from "file-type";
import { Knex } from "knex";
import path from "path";
import { v4 as uuidv4 } from 'uuid';


export const getSpotCategories : () => Promise<ISelectionSpotCategory[]> = async () => {
  try {
    const queryResult = await dbConnectionPool('spot_category').select('*');
    const spotCategories : ISelectionSpotCategory[] = queryResult.map((category) => {
      return {
        id: category.spot_category_id,
        name: category.spot_category_name,
      };
    });

    return spotCategories;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 카테고리를 가져오는데 실패했습니다');
  }
}

export async function createSpots(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  spots: ISelectionSpot[]
) : Promise<void> {
  const spotsIdsPhotos: Array<{id: string, photos: Array<string | File>}> = [];
  const spotsIdsHashtags: Array<{id: string, hashtags: number[]}> = [];

  // 각 spot에 대해 spot_id를 생성하고, spot_hashtag, spot_image 테이블에 데이터 삽입
  const spotsToInsert = spots.map((spot, index) => {
    const spotId = uuidv4();
    spotsIdsPhotos.push({
      id: spotId,
      photos: spot.photos
    });
    spotsIdsHashtags.push({
      id: spotId,
      hashtags: spot.hashtags as number[]
    });

    return {
      spot_id: transaction.fn.uuidToBin(spotId),
      slt_id: selectionId,
      spot_order: index+1,
      spot_title: spot.title,
      spot_description: spot.description,
      spot_category_id: spot.category,
      spot_gmap_id: spot.placeId,
      spot_gmap_address: spot.formattedAddress,
      spot_gmap_latitude: spot.latitude,
      spot_gmap_longitude: spot.longitude
    };
  });

  try {
    await transaction('spot')
      .insert(spotsToInsert);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟을 생성하는데 실패했습니다');
  }

  // 이미지 타입이 File인 경우 파일을 저장하고, 파일 경로로 변경
  for (let i = 0; i < spotsIdsPhotos.length; i++) {
    for (let j = 0; j < spotsIdsPhotos[i].photos.length; j++) {
      if (spotsIdsPhotos[i].photos[j] instanceof File) {
        const filePath : string = await saveSpotPhoto(spotsIdsPhotos[i].photos[j] as File);
        spotsIdsPhotos[i].photos[j] = filePath;
      }
    }
  }

  await createSpotHashtags(
    transaction, 
    spotsIdsHashtags as Array<{id: string, hashtags: number[]}>
  );

  await createSpotImages(
    transaction, 
    spotsIdsPhotos as Array<{id: string, photos: Array<string>}>
  );
}

export async function createTemporarySpots(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  spots: ISelectionSpot[]
) : Promise<void> {
  const spotsIdsPhotos : Array<{id: string, photos: Array<string | File>}> = [];
  const spotsIdsHashtags : Array<{id: string, hashtags: number[]}> = [];

  // 각 spot에 대해 spot_id를 생성하고, spot_hashtag, spot_image 테이블에 데이터 삽입
  const spotsToInsert = spots.map((spot, index) => {
    const spotId = uuidv4();
    spotsIdsPhotos.push({
      id: spotId,
      photos: spot.photos
    });
    spotsIdsHashtags.push({
      id: spotId,
      hashtags: spot.hashtags as number[]
    });

    return {
      spot_temp_id: transaction.fn.uuidToBin(spotId),
      slt_temp_id: selectionId,
      spot_temp_order: index+1,
      spot_category_id: spot.category,
      spot_temp_title: spot.title,
      spot_temp_description: spot.description,
      spot_temp_gmap_id: spot.placeId,
      spot_temp_gmap_address: spot.formattedAddress,
      spot_temp_gmap_latitude: spot.latitude,
      spot_temp_gmap_longitude: spot.longitude
    };
  });

  try {
    await transaction('spot_temporary')
      .insert(spotsToInsert);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟을 생성하는데 실패했습니다');
  }

  // 이미지 타입이 File인 경우 파일을 저장하고, 파일 경로로 변경
  for (let i = 0; i < spotsIdsPhotos.length; i++) {
    for (let j = 0; j < spotsIdsPhotos[i].photos.length; j++) {
      if (spotsIdsPhotos[i].photos[j] instanceof File) {
        const filePath : string = await saveSpotPhoto(spotsIdsPhotos[i].photos[j] as File);
        spotsIdsPhotos[i].photos[j] = filePath;
      }
    }
  }

  await createTemporarySpotHashtags(
    transaction, 
    spotsIdsHashtags as Array<{id: string, hashtags: number[]}>
  );

  await createSpotTemporaryImages(
    transaction, 
    spotsIdsPhotos as Array<{id: string, photos: Array<string>}>
  );
}

export const saveSpotPhoto : (imageFile: File) => Promise<string> = async (imageFile: File) => {
  const newFileName : string = `${Date.now()}-${uuidv4()}`;
  const fileType : FileTypeResult | undefined = await fileTypeFromBlob(imageFile);
  const filePath : string = `${newFileName}.${fileType?.mime.split('/')[1]}`;

  try {
    // 디렉토리가 존재하지 않으면 생성
    const directoryPath : string = path.join('.', 'public', 'images', 'selections', 'spots');
    await createDirectory(directoryPath);

    // 파일을 public/images/selections/spots 디렉토리에 저장
    const savePath : string = path.join('.', 'public', 'images', 'selections', 'spots', filePath);
    await saveFile(savePath, imageFile);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 이미지를 저장하는데 실패했습니다');
  }
  return filePath;
};

export async function createSpotHashtags(
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

export async function createTemporarySpotHashtags(
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

export async function createSpotImages(
  transaction: Knex.Transaction<any, any[]>,
  spotPhotos: Array<{id: string, photos: Array<string>}>
) : Promise<void> {

  let insertData : Array<{
    spot_img_id: Buffer,
    spot_id: Buffer,
    spot_img_url: string,
    spot_img_order: number
  }> = [];

  for (let i = 0; i < spotPhotos.length; i++) {
    spotPhotos[i].photos.map((photo, index) => {
      insertData.push({
        spot_img_id: transaction.fn.uuidToBin(uuidv4()),
        spot_id: transaction.fn.uuidToBin(spotPhotos[i].id),
        spot_img_url: photo,
        spot_img_order: index+1
      });
    });
  }

  if (insertData.length === 0) {
    return;
  }

  try {
    await transaction('spot_image')
      .insert(insertData)
      .onConflict(['spot_id', 'spot_photo_url'])
      .ignore();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 이미지를 생성하는데 실패했습니다');
  }
}

export async function createSpotTemporaryImages(
  transaction: Knex.Transaction<any, any[]>,
  spotPhotos: Array<{id: string, photos: Array<string>}>
) : Promise<void> {

  let insertData : Array<{
    spot_temp_img_id: Buffer,
    spot_temp_id: Buffer,
    spot_temp_img_url: string,
    spot_temp_img_order: number
  }> = [];

  for (let i = 0; i < spotPhotos.length; i++) {
    spotPhotos[i].photos.map((photo, index) => {
      insertData.push({
        spot_temp_img_id: transaction.fn.uuidToBin(uuidv4()),
        spot_temp_id: transaction.fn.uuidToBin(spotPhotos[i].id),
        spot_temp_img_url: photo,
        spot_temp_img_order: index+1
      });
    });
  }

  if (insertData.length === 0) {
    return;
  }

  console.log("Inserting " + insertData.length + " spot images");
  try {
    await transaction('spot_temporary_image')
      .insert(insertData)
      .onConflict(['spot_temp_id', 'spot_temp_img_url'])
      .ignore();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 이미지를 생성하는데 실패했습니다');
  }
}