"use server";

import { dbConnectionPool } from "@/libs/db";
import { 
  ISelectionCategory, 
  ISelectionCategoryQueryResultRow, 
  ISelectionCreateCompleteData, 
  ISelectionCreateFormData, 
  ISelectionCreateTemporaryData, 
  ISelectionLocation, 
  ISelectionLocationQueryResultRow, 
  ISelectionSpot, 
  TSelectionCreateFormData
} from "@/models/selection.model";
import { Knex } from "knex";
import { fileTypeFromBlob, FileTypeResult } from "file-type";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import {
  checkIfDirectoryOrFileExists,
  createDirectory,
  saveFile
} from "@/utils/fileStorage";
import { SELECTION_STATUS } from "@/constants/selection.constants";
import { createSpots, createTemporarySpots } from "./spot.services";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError
} from "@/utils/errors";

import axios from "axios";

export async function getSelectionCategories(): Promise<ISelectionCategory[]> {
  try {
    const queryResult: ISelectionCategoryQueryResultRow[] =
      await dbConnectionPool
        .column([
          "selection_category.slt_category_id as category_id",
          "selection_category.slt_category_name as category_name"
        ])
        .select()
        .from("selection_category");

    const categories: ISelectionCategory[] = queryResult.map((row) => {
      return {
        id: row.category_id,
        name: row.category_name
      };
    });

    return categories;
  } catch (error) {
    console.error(error);
    throw new InternalServerError("셀렉션 카테고리를 가져오는 데 실패했습니다");
  }
}

export async function getSelectionLocations(): Promise<ISelectionLocation[]> {
  try {
    const queryResult: ISelectionLocationQueryResultRow[] =
      await dbConnectionPool
        .column([
          "selection_location.slt_location_id as location_id",
          "selection_location.slt_location_name as location_name",
          "selection_location_option.slt_location_option_id as location_option_id",
          "selection_location_option.slt_location_option_name as location_option_name"
        ])
        .select()
        .from("selection_location")
        .join(
          "selection_location_option",
          "selection_location.slt_location_id",
          "selection_location_option.slt_location_id"
        )
        .orderBy("selection_location.slt_location_id", "asc");

    const locations: Array<ISelectionLocation> = [];
    queryResult.forEach((row: ISelectionLocationQueryResultRow) => {
      const locationId = row.location_id;
      const locationName = row.location_name;
      const locationOptionId = row.location_option_id;
      const locationOptionName = row.location_option_name;

      const location = locations.find((location) => location.id === locationId);
      if (location) {
        location.options.push({
          id: locationOptionId,
          name: locationOptionName
        });
      } else {
        locations.push({
          id: locationId,
          name: locationName,
          options: [
            {
              id: locationOptionId,
              name: locationOptionName
            }
          ]
        });
      }
    });

    return locations;
  } catch (error) {
    console.error(error);
    throw new InternalServerError("셀렉션 위치를 가져오는 데 실패했습니다");
  }
}

export async function createSelection(
  transaction: Knex.Transaction<any, any[]>,
  formData: ISelectionCreateCompleteData
) : Promise<void> {
  // 이미지 파일이 FormData로 전송된 경우 파일을 저장하고 파일 경로를 formData.img에 대입
  if (formData.img instanceof File) {
    const filePath : string = await saveSelectionImage(formData.img);
    formData.img = filePath;
  }

  // 해당 해시태그가 존재하지 않으면 새로 생성
  // 셀렉션 해시태그를 생성할 해시테그 id 배열로 변환
  formData.hashtags = await createHashtags(
    transaction, 
    formData.hashtags as string[]
  ) as number[];

  // 각 spot에 대해 해시태그 생성
  // 셀렉션에 포함된 spot들의 해시태그를 생성할 해시테그 id 배열로 변환
  await createHashtagsForSpots(transaction, formData.spots);

  let queryResult : number[];
  try {
    queryResult = await transaction('selection')
      .insert({
        slt_title: formData.title,
        slt_status: formData.status,
        slt_category_id: formData.category,
        slt_location_option_id: formData.location.subLocation,
        slt_description: formData.description,
        slt_img: formData.img,
      }, ['slt_id']);
  } catch (error : any) {
    console.error(error);
    throw new InternalServerError('셀렉션 생성에 실패했습니다');
  }

  const selectionId : number = queryResult[0];
  await createSelectionHashtags(
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
    formData.hashtags = await createHashtags(
      transaction, 
      formData.hashtags as string[]
    ) as number[];
  }

  // 각 spot에 대해 해시태그 생성
  // 셀렉션에 포함된 spot들의 해시태그를 생성할 해시테그 id 배열로 변환
  if (formData.spots && formData.spots.length > 0)
    await createHashtagsForSpots(transaction, formData.spots);

  let queryResult: number[];
  try {
    queryResult = await transaction('selection_temporary')
      .insert({
        slt_temp_title: formData.title,
        slt_category_id: formData.category ?? null,
        slt_location_option_id: formData.location?.subLocation ?? null,
        slt_temp_description: formData.description ?? null,
        slt_temp_img: formData.img ?? null,
      }, ['slt_temp_id']);
  } catch (error : any) {
    console.error(error);
    throw new InternalServerError('임시 셀렉션 생성에 실패했습니다');
  }

  const selectionId : number = queryResult[0];
  if (formData.hashtags && formData.hashtags.length > 0) {
    await createTemporarySelectionHashtags(
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

export async function createHashtags(
  transaction: Knex.Transaction<any, any[]>,
  hashtags: string[]
): Promise<number[]> {
  const hashtagsToInsert: { htag_name: string }[] = hashtags.map((hashtag) => {
    return {
      htag_name: hashtag
    };
  });

  try {
    await transaction("hashtag")
      .insert(hashtagsToInsert)
      .onConflict("htag_name")
      .merge();

    const querySelectResult = await transaction("hashtag")
      .select("htag_id")
      .whereIn("htag_name", hashtags);

    return querySelectResult.map((row) => row.htag_id);
  } catch (error) {
    console.error(error);
    throw new InternalServerError("해시태그 생성에 실패했습니다");
  }
}

export async function createHashtagsForSpots(
  transaction: Knex.Transaction<any, any[]>,
  spots: ISelectionSpot[]
) : Promise<void> {
  if (spots.length === 0) {
    throw new BadRequestError('스팟이 필요합니다');
  }

  const allHashtags = spots.map((spot) => spot.hashtags).flat() as string[];
  const hashtagsToInsert : {htag_name: string}[] = allHashtags.map((hashtag) => {
    return {
      htag_name: hashtag
    };
  });

  if (hashtagsToInsert.length === 0) {
    return;
  }

  try {
    await transaction('hashtag')
      .insert(hashtagsToInsert)
      .onConflict('htag_name')
      .merge();
  } catch (error) {
    console.error(error);
    throw new InternalServerError('해시태그 생성에 실패했습니다');
  }

  const querySelectResult = await transaction('hashtag')
    .select('htag_id', 'htag_name')
    .whereIn('htag_name', allHashtags);

  querySelectResult.forEach((row) => {
    for (let i = 0; i < spots.length; i++) {
      if (spots[i].hashtags.includes(row.htag_name)) {
        spots[i].hashtags.push(row.htag_id);
        spots[i].hashtags.splice(spots[i].hashtags.indexOf(row.htag_name), 1);
      }
    }
  });
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

async function createSelectionHashtags(
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

export async function createTemporarySelectionHashtags(
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

export async function prepareSelectionCreateFormData(
  formData: FormData
) : Promise<TSelectionCreateFormData> {
  let data: ISelectionCreateFormData = {
    title: String(formData.get("title")),
    status: String(formData.get("status")) as "public" | "private" | "temp"
  };

  if (formData.get("img")) {
    data = {
      ...data,
      img: formData.get("img") as File | string
    };
  }

  if (formData.get("category")) {
    data = {
      ...data,
      category: Number(formData.get("category"))
    };
  }

  if (formData.get("description")) {
    data = {
      ...data,
      description: String(formData.get("description"))
    };
  }

  if (formData.get("spots")) {
    const spots = JSON.parse(String(formData.get("spots")));
    if (spots?.length) {
      for (let i = 0; i < spots.length; i++) {
        const images: Array<string | File> = await extractSpotImages(
          spots[i].placeId,
          formData
        );

        // FormData에서 이미지 파일을 추출하여 spots[i].photos에 다시 대입
        const photos: (File | string)[] = images.map((image) => {
          if (image instanceof File) {
            return image;
          } else {
            return image as string;
          }
        });

        if (photos.length > 0) spots[i].photos = photos;
      }
    }
    data = {
      ...data,
      spots
    };
  }

  if (formData.get("hashtags")) {
    const hashtags = JSON.parse(String(formData.get("hashtags")));
    if (!Array.isArray(hashtags)) {
      data.hashtags = [];
    } else {
      data = {
        ...data,
        hashtags
      };
    }
  }

  if (formData.get("location")) {
    const location: {
      location: number;
      subLocation: number;
    } = JSON.parse(String(formData.get("location")));

    if (!isNaN(location.location) && !isNaN(location.subLocation)) {
      data = {
        ...data,
        location: {
          location: location.location,
          subLocation: location.subLocation
        }
      };
    }
  }

  if (data.status === "temp") {
    return data as ISelectionCreateTemporaryData;
  }

  return data as ISelectionCreateCompleteData;
}

// FormData에서 spotId에 해당하는 이미지 파일을 추출하여 반환
async function extractSpotImages(
  placeId: string,
  formData: FormData
): Promise<Array<string | File>> {
  const keys: string[] = Array.from(formData.keys()).sort();

  return keys
    .map((key) => {
      if (key.startsWith(`spots[${placeId}][photos]`)) {
        return formData.get(key);
      }
      return null;
    })
    .filter((image) => image !== null);
}

export async function validateTitle(title: string): Promise<void> {
  if (!title) {
    throw new BadRequestError("제목은 필수입니다");
  }

  if (title.length > 128) {
    throw new BadRequestError("제목은 128자 이하여야 합니다");
  }
}

export async function validateCategory(
  category: number | undefined
): Promise<void> {
  if (category == null) {
    throw new BadRequestError("카테고리는 필수입니다");
  }

  if (isNaN(category)) {
    throw new BadRequestError(
      "유효하지 않은 카테고리입니다. 카테고리는 정수값이어야 합니다"
    );
  }

  let queryResult: ISelectionCategoryQueryResultRow[];
  try {
    queryResult = await dbConnectionPool("selection_category").where(
      "slt_category_id",
      category
    );
  } catch (error) {
    console.error(error);
    throw new InternalServerError("카테고리를 확인하는데 실패했습니다");
  }

  if (queryResult.length === 0) {
    throw new BadRequestError(
      "유효하지 않은 카테고리입니다. 카테고리가 존재하지 않습니다"
    );
  }
}

export async function validateLocation(
  location: { location: number; subLocation: number } | undefined
): Promise<void> {
  if (!location) {
    throw new BadRequestError("위치는 필수입니다");
  }

  if (typeof location !== "object") {
    throw new BadRequestError(
      "유효하지 않은 위치입니다. 위치는 location 및 subLocation 속성을 가진 객체여야 합니다"
    );
  }

  if (isNaN(location.location) || isNaN(location.subLocation)) {
    throw new BadRequestError(
      "유효하지 않은 위치입니다. location 및 subLocation은 정수값이어야 합니다"
    );
  }

  let queryResult: ISelectionLocationQueryResultRow[];
  try {
    queryResult = await dbConnectionPool("selection_location_option")
      .where("slt_location_option_id", location.subLocation)
      .andWhere("slt_location_id", location.location);
  } catch (error) {
    console.error(error);
    throw new InternalServerError("위치를 확인하는데 실패했습니다");
  }

  if (queryResult.length === 0) {
    throw new BadRequestError(
      "유효하지 않은 위치입니다. 위치가 존재하지 않습니다"
    );
  }
}

export async function validateDescription(
  description: string | undefined
): Promise<void> {
  if (!description) {
    throw new BadRequestError("설명은 필수입니다");
  }
}

export async function validateImg(
  img: File | string | undefined
): Promise<void> {
  if (!img) {
    throw new BadRequestError("이미지는 필수입니다");
  }

  if (!(img instanceof File) && typeof img !== "string") {
    throw new BadRequestError(
      "유효하지 않은 이미지입니다. 이미지는 파일 또는 문자열(URL)이어야 합니다"
    );
  }

  // if the image is a file
  if (img instanceof File) {
    // if the file size is bigger than 2MB
    if (img.size > 2 * 1024 * 1024) {
      throw new BadRequestError("이미지는 2MB 이하여야 합니다");
    }

    const fileType = await fileTypeFromBlob(img);
    if (!fileType) {
      throw new BadRequestError("이미지 파일이 아닙니다");
    }

    if (fileType?.mime != "image/jpeg" && fileType?.mime != "image/png") {
      throw new BadRequestError("이미지는 JPEG 또는 PNG 형식이어야 합니다");
    }
    // if the image is a string (URL), check if it exists in the database
  } else {
    const imgPath: string = path.join(
      ".",
      "public",
      "images",
      "selections",
      img
    );
    await checkIfDirectoryOrFileExists(imgPath);

    try {
      const queryResult = await dbConnectionPool("selection").where(
        "slt_img",
        img
      );

      if (queryResult.length === 0) {
        throw new BadRequestError(
          "유효하지 않은 이미지입니다. 이미지가 존재하지 않습니다"
        );
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerError("이미지를 확인하는데 실패했습니다");
    }
  }
}

export async function validateSpots(
  spots: ISelectionSpot[] | undefined
): Promise<void> {
  if (!spots) {
    throw new BadRequestError("스팟은 필수입니다");
  }

  if (!Array.isArray(spots)) {
    throw new BadRequestError(
      "유효하지 않은 스팟입니다. 스팟은 배열이어야 합니다"
    );
  }

  // 스팟의 placeId는 고유해야 스팟을 식별할 수 있음
  const placeIds: string[] = [];

  for (let i = 0; i < spots.length; i++) {
    await validateTitle(spots[i].title);
    await validateDescription(spots[i].description);

    if (!spots[i].placeId) {
      throw new BadRequestError(
        `스팟 ${spots[i].title}의 placeId는 필수입니다`
      );
    }
    if (placeIds.includes(spots[i].placeId)) {
      throw new BadRequestError(
        `스팟 ${spots[i].title}의 placeId는 고유해야 합니다`
      );
    }
    placeIds.push(spots[i].placeId);

    if (!spots[i].formattedAddress) {
      throw new BadRequestError(
        `스팟 ${spots[i].title}의 주소가 누락되었습니다`
      );
    }
    if (typeof spots[i].formattedAddress !== "string") {
      throw new BadRequestError(
        `스팟 ${spots[i].title}의 주소가 유효하지 않습니다`
      );
    }

    await validateSpotCategory(spots[i].category);
    await validateHashtags(spots[i].hashtags as string[]);

    if (!spots[i].latitude || !spots[i].longitude) {
      throw new BadRequestError(
        `스팟 ${spots[i].title}의 위도와 경도는 필수입니다`
      );
    }
    if (spots[i].latitude < -90 || spots[i].latitude > 90) {
      throw new BadRequestError(
        `스팟 ${spots[i].title}의 위도가 유효하지 않습니다`
      );
    }
    if (spots[i].longitude < -180 || spots[i].longitude > 180) {
      throw new BadRequestError(
        `스팟 ${spots[i].title}의 경도가 유효하지 않습니다`
      );
    }

    await validateSpotImages(spots[i].photos);
  }
}

export async function validateSpotCategory(
  categoryId: number | undefined
): Promise<void> {
  if (!categoryId) {
    throw new BadRequestError("카테고리는 필수입니다");
  }

  if (isNaN(categoryId)) {
    throw new BadRequestError(
      "유효하지 않은 카테고리입니다. 카테고리는 정수값이어야 합니다"
    );
  }

  let queryResult: ISelectionCategoryQueryResultRow[];
  try {
    queryResult = await dbConnectionPool("spot_category").where(
      "spot_category_id",
      categoryId
    );
  } catch (error) {
    console.error(error);
    throw new InternalServerError("카테고리를 확인하는데 실패했습니다");
  }

  if (queryResult.length === 0) {
    throw new BadRequestError(
      "유효하지 않은 카테고리입니다. 카테고리가 존재하지 않습니다"
    );
  }
}

export async function validateSpotImages(
  photos: Array<string | File> | undefined
): Promise<void> {
  if (!photos) {
    throw new BadRequestError("사진은 필수입니다");
  }

  if (!Array.isArray(photos)) {
    throw new BadRequestError(
      "유효하지 않은 사진입니다. 사진은 배열이어야 합니다"
    );
  }

  if (photos.length > 4) {
    throw new BadRequestError("최대 4개의 사진만 허용됩니다");
  }
  for (const photo of photos) {
    if (typeof photo !== "string" && !(photo instanceof File)) {
      throw new BadRequestError(
        `유효하지 않은 사진입니다. 사진은 파일 또는 문자열(URL)이어야 합니다`
      );
    }
    if (photo instanceof File) {
      await validateImg(photo as File);
    } else {
      // check for invalid characters in the file name
      const imageFileName = photo as string;
      if (imageFileName.includes("/")) {
        throw new BadRequestError(`파일 이름에 / 문자가 포함되어 있습니다.`);
      }
      if (imageFileName.includes("..")) {
        throw new BadRequestError(`파일 이름에 .. 문자가 포함되어 있습니다.`);
      }
      if (imageFileName.includes("\\")) {
        throw new BadRequestError(`파일 이름에 \\ 문자가 포함되어 있습니다.`);
      }

      try {
        const imgPath: string = path.join(
          ".",
          "public",
          "images",
          "selections",
          "spots",
          imageFileName
        );
        await checkIfDirectoryOrFileExists(imgPath);
      } catch (error) {
        console.error(error);
        throw new BadRequestError(
          `유효하지 않은 사진입니다. 사진이 존재하지 않습니다`
        );
      }
    }
  }
}

export async function validateHashtags(
  hashtags: string[] | undefined
): Promise<void> {
  if (!hashtags) {
    throw new BadRequestError("해시태그는 필수입니다");
  }
  if (!Array.isArray(hashtags)) {
    throw new BadRequestError(
      "무효한 해시태그입니다. 해시태그는 배열이어야 합니다"
    );
  }
  if (hashtags.length === 0) {
    throw new BadRequestError("해시태그는 최소한 하나 필요합니다");
  }
  if (hashtags.length > 8) {
    throw new BadRequestError("최대 8개의 해시태그만 허용됩니다");
  }
  hashtags.forEach((hashtag) => {
    if (!hashtag) {
      throw new BadRequestError("빈 해시태그는 허용되지 않습니다");
    }

    if (typeof hashtag !== "string") {
      throw new BadRequestError("무효한 해시태그");
    }

    if (hashtag.length > 40) {
      throw new BadRequestError("해시태그는 40자 이하여야 합니다");
    }
  });
}

export async function validateStatus(selectionStatus: string): Promise<void> {
  if (!SELECTION_STATUS.includes(selectionStatus)) {
    throw new BadRequestError("유효하지 않은 상태입니다");
  }
}

export async function validateData(data: TSelectionCreateFormData) : Promise<void> {
  await validateTitle(data.title);
  await validateStatus(data.status);

  // 미리저장이 아닌 경우 모든 필수 데이터를 검증
  if (data.status != "temp") {
    await validateCategory(data.category);
    await validateLocation(data.location);
    await validateDescription(data.description);
    await validateImg(data.img);
    await validateSpots(data.spots);
    await validateHashtags(data.hashtags as string[]);
  } else {
    if (data.category) {
      await validateCategory(data.category);
    }

    if (data.location) {
      await validateLocation(data.location);
    }

    if (data.description) {
      await validateDescription(data.description);
    }

    if (data.img) {
      await validateImg(data.img);
    }

    if (data.spots) {
      await validateSpots(data.spots);
    }

    if (data.hashtags) {
      await validateHashtags(data.hashtags as string[]);
    }
  }
}

export const validateHashtagsSuggestionPrompt = async (prompt: string) => {
  if (!prompt) {
    throw new BadRequestError("프롬프트는 필수입니다");
  }

  if (typeof prompt !== "string") {
    throw new BadRequestError("프롬프트는 문자열이어야 합니다");
  }

  if (prompt.length < 1) {
    throw new BadRequestError("프롬프트는 1자 이상이어야 합니다");
  }

  if (prompt.length > 128) {
    throw new BadRequestError("프롬프트는 128자 이하여야 합니다");
  }
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

export const addBookMarks = async (selectionId: number, userId: number) => {
  try {
    await dbConnectionPool("bookmark").insert({
      user_id: userId,
      slt_id: selectionId
    });
  } catch (error) {
    throw new Error("Failed to add bookmark");
  }
};

export const removeBookMarks = async (selectionId: number, userId: number) => {
  try {
    await dbConnectionPool("bookmark")
      .where({
        user_id: userId,
        slt_id: selectionId
      })
      .del();
  } catch (error) {
    throw new Error("Failed to add bookmark");
  }
};
