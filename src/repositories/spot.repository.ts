import { InternalServerError } from "@/utils/errors";
import { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid';


interface ISpot {
  spot_id: Buffer;
  slt_id: number;
  spot_order: number;
  spot_title: string;
  spot_description: string;
  spot_category_id: number;
  spot_gmap_id: string;
  spot_gmap_address: string;
  spot_gmap_latitude: number;
  spot_gmap_longitude: number;
};

interface ISpotTemporary {
  spot_temp_id: Buffer;
  slt_temp_id: number;
  spot_temp_order: number;
  spot_category_id: number;
  spot_temp_title: string;
  spot_temp_description: string;
  spot_temp_gmap_id: string;
  spot_temp_gmap_address: string;
  spot_temp_gmap_latitude: number;
  spot_temp_gmap_longitude: number;
}

export const insertMultipleSpotTemporary = async (
  transaction: Knex.Transaction<any, any[]>,
  spots: ISpotTemporary[]
) : Promise<void> => {
  try {
    await transaction('spot_temporary')
      .insert(spots);
  } catch (error : any) {
    console.error(error);
    throw new InternalServerError('임시 스팟 생성에 실패했습니다');
  }
}

export const insertMultipleSpot = async (
  transaction: Knex.Transaction<any, any[]>,
  spots: ISpot[]
) : Promise<void> => {
  try {
    await transaction('spot')
      .insert(spots);
  } catch (error : any) {
    console.error(error);
    throw new InternalServerError('스팟 생성에 실패했습니다');
  }
};

export async function insertMultipleSpotImage(
  transaction: Knex.Transaction<any, any[]>,
  spotImages: Array<{id: string, photos: Array<string>}>
) : Promise<void> {

  let insertData : Array<{
    spot_img_id: Buffer,
    spot_id: Buffer,
    spot_img_url: string,
    spot_img_order: number
  }> = [];

  for (let i = 0; i < spotImages.length; i++) {
    spotImages[i].photos.map((photo, index) => {
      insertData.push({
        spot_img_id: transaction.fn.uuidToBin(uuidv4()),
        spot_id: transaction.fn.uuidToBin(spotImages[i].id),
        spot_img_url: photo,
        spot_img_order: index+1
      });
    });
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

export async function insertMultipleSpotTemporaryImage(
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