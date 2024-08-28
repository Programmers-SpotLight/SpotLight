import 'server-only';
import { dbConnectionPool } from "@/libs/db";
import { uploadFileToS3 } from "@/libs/s3";
import { ISelectionSpot, ISelectionSpotCategory } from "@/models/selection.model";
import { 
  deleteMultipleSpotHashtagNotIn, 
  deleteMultipleSpotTemporaryHashtagNotIn, 
  insertMultipleSpotHashtag, 
  insertMultipleSpotTemporaryHashtag 
} from "@/repositories/hashtag.repository";
import { 
  deleteAllSpotImageBySelectionId,
  deleteMultipleSpotBySelectionIdAndNotInPlaceId,
  deleteMultipleSpotTemporaryBySelectionIdAndNotInPlaceId,
  deleteMultipleSpotTemporaryImageBySelectionIdAndNotInImageUrl,
  insertMultipleSpot, 
  insertMultipleSpotImage, 
  insertMultipleSpotTemporary, 
  insertMultipleSpotTemporaryImage, 
  selectMultipleSpotTemporaryByInPlaceId, 
  selectMultipleSpotByInPlaceId, 
  updateMultipleSpot, 
  updateMultipleSpotTemporary,
  deleteAllSpotTemporaryImageBySelectionId,
  deleteAllSpotTemporaryBySelectionId,
  deleteAllSpotBySelectionId
} from "@/repositories/spot.repository";
import { InternalServerError } from "@/utils/errors";
import { createDirectory, saveFile } from "@/utils/fileStorage";
import { fileTypeFromBlob, FileTypeResult } from "file-type";
import { Knex } from "knex";
import path, { posix } from "path";
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
    throw new InternalServerError('스팟 카테고리를 가져오는데 실패했습니다');
  }
}

export async function createSpots(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  spots: ISelectionSpot[]
) : Promise<void> {
  const spotsIdsImages: Array<{id: string, images: Array<string | File>}> = [];
  const spotsIdsHashtags: Array<{id: string, hashtags: number[]}> = [];

  // 각 spot에 대해 spot_id를 생성하고, spot_hashtag, spot_image 테이블에 데이터 삽입
  const spotsToInsert = spots.map((spot, index) => {
    const spotId = uuidv4().replace(/-/g, '');
    spotsIdsImages.push({
      id: spotId,
      images: spot.images
    });
    spotsIdsHashtags.push({
      id: spotId,
      hashtags: spot.hashtags as number[]
    });

    return {
      spot_id: transaction.raw(`UNHEX(?)`, spotId),
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
  for (let i = 0; i < spotsIdsImages.length; i++) {
    for (let j = 0; j < spotsIdsImages[i].images.length; j++) {
      if (spotsIdsImages[i].images[j] instanceof File) {
        const filePath : string = await saveSpotPhoto(spotsIdsImages[i].images[j] as File);
        spotsIdsImages[i].images[j] = filePath;
      }
    }
  }

  await insertMultipleSpotHashtag(
    transaction, 
    spotsIdsHashtags as Array<{id: string, hashtags: number[]}>
  );

  const images = spotsIdsImages.map((spot) => {
    return spot.images;
  }).flat();

  if (images.length > 0) {
    await insertMultipleSpotImage(
      transaction, 
      spotsIdsImages as Array<{id: string, images: Array<string>}>
    );
  }
}

export async function createTemporarySpots(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  spots: ISelectionSpot[]
) : Promise<void> {
  const spotsIdsImages : Array<{id: string, images: Array<string | File>}> = [];
  const spotsIdsHashtags : Array<{id: string, hashtags: number[]}> = [];

  // 각 spot에 대해 spot_id를 생성하고, spot_hashtag, spot_image 테이블에 데이터 삽입
  const spotsToInsert = spots.map((spot, index) => {
    const spotId = uuidv4().replace(/-/g, '');
    spotsIdsImages.push({
      id: spotId,
      images: spot.images
    });
    spotsIdsHashtags.push({
      id: spotId,
      hashtags: spot.hashtags as number[]
    });

    return {
      spot_temp_id: transaction.raw(`UNHEX(?)`, spotId),
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
  for (let i = 0; i < spotsIdsImages.length; i++) {
    for (let j = 0; j < spotsIdsImages[i].images.length; j++) {
      if (spotsIdsImages[i].images[j] instanceof File) {
        const filePath : string = await saveSpotPhoto(spotsIdsImages[i].images[j] as File);
        spotsIdsImages[i].images[j] = filePath;
      }
    }
  }

  await insertMultipleSpotTemporaryHashtag(
    transaction, 
    spotsIdsHashtags as Array<{id: string, hashtags: number[]}>
  );

  const images = spotsIdsImages.map((spot) => {
    return spot.images;
  }).flat();

  if (images.length > 0) {
    await insertMultipleSpotTemporaryImage(
      transaction, 
      spotsIdsImages as Array<{id: string, images: Array<string>}>
    );
  }
}

export const saveSpotPhoto : (imageFile: File) => Promise<string> = async (imageFile: File) => {
  const newFileName : string = `${Date.now()}-${uuidv4()}`;
  const fileType : FileTypeResult | undefined = await fileTypeFromBlob(imageFile);
  const filePath : string = `${newFileName}.${fileType?.mime.split('/')[1]}`;

  try {
    // 파일을 public/images/selections/spots 디렉토리에 저장
    const savePath : string = posix.join('public/images/selections/spots', filePath);

    const arrayBuffer : ArrayBuffer = await imageFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    await uploadFileToS3({
      fileName: savePath,
      fileType: fileType?.mime || '',
      fileContent: buffer
    })

    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${savePath}`;
  } catch (error) {
    throw new InternalServerError('스팟 이미지를 저장하는데 실패했습니다');
  }
};

export async function upsertTemporarySpots(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  spots: ISelectionSpot[]
) {
  const spotsIdsImages : Array<{id: string, images: Array<string | File>}> = [];
  const spotsIdsHashtags : Array<{id: string, hashtags: number[]}> = [];

  const spotsToInsert = spots.map((spot, index) => {
    const spotId = uuidv4().replace(/-/g, '');
    spotsIdsImages.push({
      id: spotId,
      images: spot.images
    });
    spotsIdsHashtags.push({
      id: spotId,
      hashtags: spot.hashtags as number[]
    });

    return {
      spot_temp_id: transaction.raw(`UNHEX(?)`, spotId),
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

  const spotsToInsertFiltered = spotsToInsert.filter((spot) => spot !== undefined);

  await deleteAllSpotTemporaryBySelectionId(transaction, selectionId);
  if (spotsToInsertFiltered.length > 0)
    await insertMultipleSpotTemporary(transaction, spotsToInsertFiltered);

  // 이미지 타입이 File인 경우 파일을 저장하고, 파일 경로로 변경
  for (let i = 0; i < spotsIdsImages.length; i++) {
    for (let j = 0; j < spotsIdsImages[i].images.length; j++) {
      if (spotsIdsImages[i].images[j] instanceof File) {
        const filePath : string = await saveSpotPhoto(spotsIdsImages[i].images[j] as File);
        spotsIdsImages[i].images[j] = filePath;
      }
    }
  }

  await insertMultipleSpotTemporaryHashtag(
    transaction, 
    spotsIdsHashtags as Array<{id: string, hashtags: number[]}>
  );

  await deleteMultipleSpotTemporaryHashtagNotIn(
    transaction,
    selectionId,
    spotsIdsHashtags.map((spot) => spot.hashtags).flat()
  )

  const images = spotsIdsImages.map((spot) => {
    return spot.images;
  }).flat(); 

  if (images.length > 0) {
    await insertMultipleSpotTemporaryImage(
      transaction, 
      spotsIdsImages as Array<{id: string, images: Array<string>}>
    );

    await deleteMultipleSpotTemporaryImageBySelectionIdAndNotInImageUrl(
      transaction,
      selectionId,
      spotsIdsImages.map((spot) => spot.images as string[]).flat()
    )
  } else {
    await deleteAllSpotTemporaryImageBySelectionId(transaction, selectionId);
  }
}

export async function upsertSpots(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  spots: ISelectionSpot[]
) {
  const spotsIdsImages : Array<{id: string, images: Array<string | File>}> = [];
  const spotsIdsHashtags : Array<{id: string, hashtags: number[]}> = [];

  const spotsToInsert = spots.map((spot, index) => {
    const spotId = uuidv4().replace(/-/g, '');
    spotsIdsImages.push({
      id: spotId,
      images: spot.images
    });
    spotsIdsHashtags.push({
      id: spotId,
      hashtags: spot.hashtags as number[]
    });

    return {
      spot_id: transaction.raw(`UNHEX(?)`, spotId),
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

  const spotsToInsertFiltered = spotsToInsert.filter((spot) => spot !== undefined);

  await deleteAllSpotBySelectionId(transaction, selectionId);
  await insertMultipleSpot(transaction, spotsToInsertFiltered);

  // 이미지 타입이 File인 경우 파일을 저장하고, 파일 경로로 변경
  for (let i = 0; i < spotsIdsImages.length; i++) {
    for (let j = 0; j < spotsIdsImages[i].images.length; j++) {
      if (spotsIdsImages[i].images[j] instanceof File) {
        const filePath : string = await saveSpotPhoto(spotsIdsImages[i].images[j] as File);
        spotsIdsImages[i].images[j] = filePath;
      }
    }
  }

  await insertMultipleSpotHashtag(
    transaction, 
    spotsIdsHashtags as Array<{id: string, hashtags: number[]}>
  );

  await deleteMultipleSpotHashtagNotIn(
    transaction,
    selectionId,
    spotsIdsHashtags.map((spot) => spot.hashtags).flat()
  )

  const images = spotsIdsImages.map((spot) => {
    return spot.images;
  }).flat();

  if (images.length > 0) {
    await deleteAllSpotImageBySelectionId(transaction, selectionId);
    await insertMultipleSpotImage(
      transaction, 
      spotsIdsImages as Array<{id: string, images: Array<string>}>
    );
  } else {
    await deleteAllSpotImageBySelectionId(transaction, selectionId);
  }
}