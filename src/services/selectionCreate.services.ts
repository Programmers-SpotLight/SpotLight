import 'server-only';
import { 
  ISelectionCreateCompleteData, 
  ISelectionCreateTemporaryData, 
  ISelectionSpot, 
} from "@/models/selection.model";
import { Knex } from "knex";
import { fileTypeFromBlob, FileTypeResult } from "file-type";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import {
  createDirectory,
  saveFile
} from "@/utils/fileStorage";
import { createSpots, createTemporarySpots } from "./spot.services";
import {
  InternalServerError,
  NotFoundError
} from "@/utils/errors";

import axios from "axios";
import { 
  insertHashtagsGetIds, 
  insertHashtagsGetIdsNames, 
  insertSelectionHashtags, 
  insertTemporarySelectionHashtags 
} from '@/repositories/hashtag.repository';
import { insertSelectionGetId, insertSelectionTemporary } from '@/repositories/selection.repository';


export async function createSelection(
  transaction: Knex.Transaction<any, any[]>,
  userId: number,
  formData: ISelectionCreateCompleteData
) : Promise<void> {
  // 이미지 파일이 FormData로 전송된 경우 파일을 저장하고 파일 경로를 formData.img에 대입
  if (formData.img instanceof File) {
    const filePath : string = await saveSelectionImage(formData.img);
    formData.img = filePath;
  }

  // 해당 해시태그가 존재하지 않으면 새로 생성
  // 셀렉션 해시태그를 생성할 해시테그 id 배열로 변환
  formData.hashtags = await insertHashtagsGetIds(
    transaction, 
    formData.hashtags as string[]
  ) as number[];

  // 각 spot에 대해 해시태그 생성
  // 셀렉션에 포함된 spot들의 해시태그를 생성할 해시테그 id 배열로 변환
  await createHashtagsForSpots(transaction, formData.spots);

  const queryResult : number[] = await insertSelectionGetId(transaction, {
    user_id: userId,
    slt_title: formData.title,
    slt_status: formData.status,
    slt_category_id: formData.category,
    slt_location_option_id: formData.location.subLocation,
    slt_description: formData.description,
    slt_img: formData.img
  });

  const selectionId : number = queryResult[0];
  await insertSelectionHashtags(
    transaction, 
    selectionId, 
    formData.hashtags as number[]
  );

  await createSpots(
    transaction, 
    selectionId, 
    formData.spots
  );
}

export async function createTemporarySelection(
  transaction: Knex.Transaction<any, any[]>,
  userId: number,
  formData: ISelectionCreateTemporaryData
) : Promise<void> {
  // 이미지 파일이 FormData로 전송된 경우 파일을 저장하고 파일 경로를 formData.img에 대입
  if (formData.img instanceof File) {
    const filePath: string = await saveSelectionImage(formData.img);
    formData.img = filePath;
  }

  // 해당 해시태그가 존재하지 않으면 새로 생성
  // 셀렉션 해시태그를 생성할 해시테그 id 배열로 변환
  if (formData.hashtags && formData.hashtags.length > 0) {
    formData.hashtags = await insertHashtagsGetIds(
      transaction, 
      formData.hashtags as string[]
    ) as number[];
  }

  // 각 spot에 대해 해시태그 생성
  // 셀렉션에 포함된 spot들의 해시태그를 생성할 해시테그 id 배열로 변환
  if (formData.spots && formData.spots.length > 0)
    await createHashtagsForSpots(transaction, formData.spots);

  const queryResult: number[] = await insertSelectionTemporary(transaction, {
    user_id: userId,
    slt_temp_title: formData.title,
    slt_category_id: formData.category || null,
    slt_location_option_id: formData.location?.subLocation || null,
    slt_temp_description: formData.description || null,
    slt_temp_img: formData.img || null
  });

  const selectionId : number = queryResult[0];
  if (formData.hashtags && formData.hashtags.length > 0) {
    await insertTemporarySelectionHashtags(
      transaction, 
      selectionId, 
      formData.hashtags as number[]
    );
  }

  if (formData.spots && formData.spots.length > 0) {
    await createTemporarySpots(
      transaction, 
      selectionId, 
      formData.spots
    );
  }
}

export async function createHashtagsForSpots(
  transaction: Knex.Transaction<any, any[]>,
  spots: ISelectionSpot[]
) : Promise<void> {
  const allHashtags = spots.map((spot) => spot.hashtags).flat() as string[];
  try {
    const querySelectResult = await insertHashtagsGetIdsNames(
      transaction, 
      allHashtags
    );

    querySelectResult.forEach((row) => {
      for (let i = 0; i < spots.length; i++) {
        if (spots[i].hashtags.includes(row.htag_name)) {
          spots[i].hashtags.push(row.htag_id);
          spots[i].hashtags.splice(spots[i].hashtags.indexOf(row.htag_name), 1);
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError('스팟 해시태그를 생성하는데 실패했습니다');
  }
};

export async function saveSelectionImage(imageFile: File) : Promise<string> {
  const newFileName : string = `${Date.now()}-${uuidv4()}`;
  const fileType : FileTypeResult | undefined = await fileTypeFromBlob(imageFile);
  const filePath : string = `${newFileName}.${fileType?.mime.split('/')[1]}`;

  try {
    // 디렉토리가 존재하지 않으면 생성
    const directoryPath: string = path.join(
      ".",
      "public",
      "images",
      "selections"
    );
    await createDirectory(directoryPath);

    // 파일을 public/images/selections 디렉토리에 저장
    const savePath: string = path.join(
      ".",
      "public",
      "images",
      "selections",
      filePath
    );
    await saveFile(savePath, imageFile);
  } catch (error) {
    console.error(error);
    throw new InternalServerError("셀렉션 이미지 저장에 실패했습니다");
  }
  return filePath;
}

export const requestHashtagsSuggestionFromAI = async (prompt: string) => {
  const finalPrompt = `${prompt}와 관련된 해시태그 8개 추천좀 해줘`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo-1106",
        messages: [{ role: "user", content: finalPrompt }],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    if (response.data.choices.length === 0) {
      throw new InternalServerError("해시태그 추천에 실패했습니다");
    }

    const responseByAI: string =
      response.data.choices[0].message.content.replace(/[\n\r]/g, " ");
    let hashtags = responseByAI
      .match(/#[^\s#\n]+/g)
      ?.map((hashtag) => hashtag.slice(1));

    // Return an array of hashtags or an empty array if none are found
    return hashtags || [];
  } catch (error: any) {
    console.error(error);
    throw new InternalServerError("해시태그 추천에 실패했습니다");
  }
};

export const requestGeocoding = async (googleMapsPlaceId: string) => {
  const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&place_id=${googleMapsPlaceId}&language=ko`;

  try {
    const response = await axios.get(API_URL);
    if (response.data.status === "ZERO_RESULTS") {
      throw new NotFoundError("해당 장소를 찾을 수 없습니다");
    }

    const geoData = {
      formatted_address: response.data.results[0].formatted_address,
      latitude: response.data.results[0].geometry.location.lat,
      longitude: response.data.results[0].geometry.location.lng
    };

    return geoData;
  } catch (error: any) {
    console.error(error);
    throw new InternalServerError("Geocoding에 실패했습니다");
  }
};

export const requestReverseGeocoding = async (
  latitude: string,
  longitude: string
) => {
  const API_URL_PART1 = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}`;
  const API_URL_PART2 = `&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=ko&result_type=street_address`;

  try {
    const response = await axios.get(API_URL_PART1 + API_URL_PART2);

    const geoData: { formatted_address: string; place_id: string } = {
      formatted_address: response.data.results[0].formatted_address,
      place_id: response.data.results[0].place_id
    };

    return geoData;
  } catch (error: any) {
    console.error(error);
    throw new InternalServerError("Reverse geocoding에 실패했습니다");
  }
};