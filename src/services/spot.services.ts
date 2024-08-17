'use server';

import { dbConnectionPool } from "@/libs/db";
import { ISelectionSpot, ISelectionSpotCategory } from "@/models/selection.model";
import { insertMultipleSpotHashtag, insertMultipleSpotTemporaryHashtag } from "@/repositories/hashtag.repository";
import { 
  insertMultipleSpot, 
  insertMultipleSpotImage, 
  insertMultipleSpotTemporary, 
  insertMultipleSpotTemporaryImage 
} from "@/repositories/spot.repository";
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

  await insertMultipleSpot(transaction, spotsToInsert);

  // 이미지 타입이 File인 경우 파일을 저장하고, 파일 경로로 변경
  for (let i = 0; i < spotsIdsPhotos.length; i++) {
    for (let j = 0; j < spotsIdsPhotos[i].photos.length; j++) {
      if (spotsIdsPhotos[i].photos[j] instanceof File) {
        const filePath : string = await saveSpotPhoto(spotsIdsPhotos[i].photos[j] as File);
        spotsIdsPhotos[i].photos[j] = filePath;
      }
    }
  }

  await insertMultipleSpotHashtag(
    transaction, 
    spotsIdsHashtags as Array<{id: string, hashtags: number[]}>
  );

  const photos = spotsIdsPhotos.map((spot) => {
    return spot.photos;
  }).flat();

  if (photos.length > 0) {
    await insertMultipleSpotImage(
      transaction, 
      spotsIdsPhotos as Array<{id: string, photos: Array<string>}>
    );
  }
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

  await insertMultipleSpotTemporary(transaction, spotsToInsert);

  // 이미지 타입이 File인 경우 파일을 저장하고, 파일 경로로 변경
  for (let i = 0; i < spotsIdsPhotos.length; i++) {
    for (let j = 0; j < spotsIdsPhotos[i].photos.length; j++) {
      if (spotsIdsPhotos[i].photos[j] instanceof File) {
        const filePath : string = await saveSpotPhoto(spotsIdsPhotos[i].photos[j] as File);
        spotsIdsPhotos[i].photos[j] = filePath;
      }
    }
  }

  await insertMultipleSpotTemporaryHashtag(
    transaction, 
    spotsIdsHashtags as Array<{id: string, hashtags: number[]}>
  );

  const photos = spotsIdsPhotos.map((spot) => {
    return spot.photos;
  }).flat();

  if (photos.length > 0) {
    await insertMultipleSpotTemporaryImage(
      transaction, 
      spotsIdsPhotos as Array<{id: string, photos: Array<string>}>
    );
  }
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