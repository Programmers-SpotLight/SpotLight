'use server';

import { dbConnectionPool } from "@/libs/db";
import { 
  ISelectionCategory, 
  ISelectionCategoryQueryResultRow, 
  ISelectionCreateFormData, 
  ISelectionLocation, 
  ISelectionLocationQueryResultRow, 
  ISelectionSpot 
} from "@/models/selection.model";
import { Knex } from "knex";
import { fileTypeFromBlob, FileTypeResult } from "file-type";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { 
  checkIfDirectoryOrFileExists, 
  createDirectory, 
  saveFile 
} from "@/utils/fileStorage";
import { SELECTION_STATUS } from "@/constants/selection.constants";
import { createSpots } from "./spot.services";
import { BadRequestError, InternalServerError } from "@/utils/errors";


export async function getSelectionCategories() : Promise<ISelectionCategory[]> {
  try {
    const queryResult : ISelectionCategoryQueryResultRow[] = await dbConnectionPool
      .column([
        'selection_category.slt_category_id as category_id',
        'selection_category.slt_category_name as category_name',
      ])
      .select()
      .from('selection_category');

    const categories : ISelectionCategory[] = queryResult.map((row) => {
      return {
        id: row.category_id,
        name: row.category_name
      };
    });

    return categories;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('셀렉션 카테고리를 가져오는 데 실패했습니다');
  }
}

export async function getSelectionLocations() : Promise<ISelectionLocation[]> {
  try {
    const queryResult : ISelectionLocationQueryResultRow[] = await dbConnectionPool
      .column([
        'selection_location.slt_location_id as location_id',
        'selection_location.slt_location_name as location_name',
        'selection_location_option.slt_location_option_id as location_option_id',
        'selection_location_option.slt_location_option_name as location_option_name'
      ])
      .select()
      .from('selection_location')
      .join(
        'selection_location_option', 
        'selection_location.slt_location_id', 
        'selection_location_option.slt_location_id'
      )
      .orderBy('selection_location.slt_location_id', 'asc')

    const locations : Array<ISelectionLocation> = [];
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
          options: [{
            id: locationOptionId,
            name: locationOptionName
          }]
        });
      }
    });

    return locations;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('셀렉션 위치를 가져오는 데 실패했습니다');
  }
};

export async function createHashtags(
  transaction: Knex.Transaction<any, any[]>, 
  hashtags: string[]
) : Promise<number[]> {
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

    const querySelectResult = await transaction('hashtag')
      .select('htag_id')
      .whereIn('htag_name', hashtags);
    
    return querySelectResult.map((row) => row.htag_id);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('해시태그 생성에 실패했습니다');
  }
}

export async function saveSelectionImage(imageFile: File) : Promise<string> {
  const newFileName : string = `${Date.now()}-${uuidv4()}`;
  const fileType : FileTypeResult | undefined = await fileTypeFromBlob(imageFile);
  const filePath : string = `${newFileName}.${fileType?.mime.split('/')[1]}`;

  try {
    // 디렉토리가 존재하지 않으면 생성
    const directoryPath : string = path.join(
      '.', 
      'public', 
      'images', 
      'selections'
    );
    await createDirectory(directoryPath);

    // 파일을 public/images/selections 디렉토리에 저장
    const savePath : string = path.join(
      '.', 
      'public', 
      'images', 
      'selections', 
      filePath
    );
    await saveFile(savePath, imageFile);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('셀렉션 이미지 저장에 실패했습니다');
  }
  return filePath;
}

export async function createSelection(
  transaction: Knex.Transaction<any, any[]>,
  formData: ISelectionCreateFormData
) : Promise<void> {
  // 이미지 파일이 FormData로 전송된 경우 파일을 저장하고 파일 경로를 formData.img에 대입
  if (formData.img instanceof File) {
    const filePath : string = await saveSelectionImage(formData.img);
    formData.img = filePath;
  }

  // 해당 해시태그가 존재하지 않으면 새로 생성
  // 셀렉션 해시태그를 생성할 해시테그 id 배열로 변환
  if (formData.hashtags) {
    formData.hashtags = await createHashtags(
      transaction, 
      formData.hashtags as string[]
    ) as number[];
  }

  // 각 spot에 대해 해시태그 생성
  // 셀렉션에 포함된 spot들의 해시태그를 생성할 해시테그 id 배열로 변환
  if (formData.spots) {
    for (let i = 0; i < formData.spots.length; i++) {
      const spot = formData.spots[i];
      formData.spots[i].hashtags = await createHashtags(
        transaction, 
        spot.hashtags as string[]
      );
    }
  }

  let queryResult : number[];
  try {
    queryResult = await transaction('selection')
      .insert({
        slt_title: formData.title,
        slt_status: formData.status,
        slt_category_id: formData.category ?? null,
        slt_location_option_id: formData.location?.subLocation ?? null,
        slt_description: formData.description ?? null,
        slt_img: formData.img ?? null,
      }, ['slt_id']);
  } catch (error : any) {
    console.error(error);
    throw new InternalServerError('셀렉션 생성에 실패했습니다');
  }

  const selectionId : number = queryResult[0];
  if (formData.hashtags) {
    await createSelectionHashtags(
      transaction, 
      selectionId, 
      formData.hashtags as number[]
    );
  }

  if (formData.spots) {
    await createSpots(
      transaction, 
      selectionId, 
      formData.spots
    );
  }
}

async function createSelectionHashtags(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  hashtags: number[]
) : Promise<void> {
  for (let i = 0; i < hashtags.length; i++) {
    try {
      await transaction('selection_hashtag')
        .insert({
          slt_id: selectionId,
          slt_htag_id: transaction.fn.uuidToBin(uuidv4()),
          htag_id: hashtags[i]
        })
        .onConflict(['slt_id', 'htag_id'])
        .ignore();
    } catch (error) {
      console.error(error);
      throw new InternalServerError('셀렉션 해시태그 생성에 실패했습니다');
    }
  }
}

export async function prepareSelectionCreateFormData(
  formData: FormData
) : Promise<ISelectionCreateFormData> {
  let data: ISelectionCreateFormData = {
    title: String(formData.get("title")),
    status: String(formData.get("status"))
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
    const spots = JSON.parse(String(formData.get("spots")))
    if (spots?.length) {
      for (let i=0; i < spots.length; i++) {
        const images : Array<string | File> = await extractSpotImages(spots[i].placeId, formData);

        // FormData에서 이미지 파일을 추출하여 spots[i].photos에 추가
        const photos: (File | string)[] = images.map((image) => {
          if (image instanceof File) {
            return image;
          } else {
            return image as string;
          }
        });

        if (photos.length > 0)
          spots[i].photos = photos;
      }
    }
    data = {
      ...data,
      spots
    };
  }

  if (formData.get("hashtags")) {
    const hashtags = JSON.parse(String(formData.get("hashtags")))
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
      location: number, 
      subLocation: number 
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

  return data;
}

// FormData에서 spotId에 해당하는 이미지 파일을 추출하여 반환
async function extractSpotImages(
  placeId: string,
  formData: FormData
) : Promise<Array<string | File>> {
  const keys : string[] = Array.from(formData.keys()).sort();

  return keys.map((key) => {
    if (key.startsWith(`spots[${placeId}][photos]`)) {
      return formData.get(key);
    }
    return null;
  }).filter((image) => image !== null);
}

export async function validateTitle(title: string) : Promise<void> {
  if (!title) {
    throw new BadRequestError("제목은 필수입니다");
  }

  if (title.length > 128) {
    throw new BadRequestError("제목은 128자 이하여야 합니다");
  }
};

export async function validateCategory(
  category: number | undefined
) : Promise<void> {
  if (category == null) {
    throw new BadRequestError("카테고리는 필수입니다");
  }

  if (isNaN(category)) {
    throw new BadRequestError("유효하지 않은 카테고리입니다. 카테고리는 정수값이어야 합니다");
  }

  let queryResult: ISelectionCategoryQueryResultRow[];
  try {
    queryResult = await dbConnectionPool('selection_category')
      .where('slt_category_id', category);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('카테고리를 확인하는데 실패했습니다');
  }
  
  if (queryResult.length === 0) {
    throw new BadRequestError("유효하지 않은 카테고리입니다. 카테고리가 존재하지 않습니다");
  }
};

export async function validateLocation(
  location: { location: number; subLocation: number } | undefined
) : Promise<void> {
  if (!location) {
    throw new BadRequestError("위치는 필수입니다");
  }

  if (typeof location !== "object") {
    throw new BadRequestError("유효하지 않은 위치입니다. 위치는 location 및 subLocation 속성을 가진 객체여야 합니다");
  }

  if (isNaN(location.location) || isNaN(location.subLocation)) {
    throw new BadRequestError("유효하지 않은 위치입니다. location 및 subLocation은 정수값이어야 합니다");
  }

  let queryResult: ISelectionLocationQueryResultRow[];
  try {
    queryResult = await dbConnectionPool('selection_location_option')
      .where('slt_location_option_id', location.subLocation)
      .andWhere('slt_location_id', location.location);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('위치를 확인하는데 실패했습니다');
  }

  if (queryResult.length === 0) {
    throw new BadRequestError("유효하지 않은 위치입니다. 위치가 존재하지 않습니다");
  }
};

export async function validateDescription(
  description: string | undefined
) : Promise<void> {
  if (!description) {
    throw new BadRequestError("설명은 필수입니다");
  }
};

export async function validateImg(
  img: File | string | undefined
) : Promise<void> {
  if (!img) {
    throw new BadRequestError("이미지는 필수입니다");
  }

  if (!(img instanceof File) && typeof img !== "string") {
    throw new BadRequestError("유효하지 않은 이미지입니다. 이미지는 파일 또는 문자열(URL)이어야 합니다");
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

    if (fileType?.mime != 'image/jpeg' && fileType?.mime != 'image/png') {
      throw new BadRequestError("이미지는 JPEG 또는 PNG 형식이어야 합니다");
    }
  // if the image is a string (URL), check if it exists in the database
  } else {
    const imgPath : string = path.join(
      '.', 
      'public', 
      'images', 
      'selections', 
      img
    );
    await checkIfDirectoryOrFileExists(imgPath);

    try {
      const queryResult = await dbConnectionPool('selection')
        .where('slt_img', img);
      
      if (queryResult.length === 0) {
        throw new BadRequestError("유효하지 않은 이미지입니다. 이미지가 존재하지 않습니다");
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerError('이미지를 확인하는데 실패했습니다');
    }
  }
}

export async function validateSpots(
  spots: ISelectionSpot[] | undefined
) : Promise<void> {
  if (!spots) {
    throw new BadRequestError("스팟은 필수입니다");
  }

  if (!Array.isArray(spots)) {
    throw new BadRequestError("유효하지 않은 스팟입니다. 스팟은 배열이어야 합니다");
  }

  for (let i = 0; i < spots.length; i++) {
    await validateTitle(spots[i].title);
    await validateDescription(spots[i].description);

    if (!spots[i].formattedAddress) {
      throw new BadRequestError(`스팟 ${spots[i].title}의 주소가 누락되었습니다`);
    }
    if (typeof spots[i].formattedAddress !== "string") {
      throw new BadRequestError(`스팟 ${spots[i].title}의 주소가 유효하지 않습니다`);
    }

    await validateSpotCategory(spots[i].category);
    await validateHashtags(spots[i].hashtags as string[]);

    if (!spots[i].latitude || !spots[i].longitude) {
      throw new BadRequestError(`스팟 ${spots[i].title}의 위도와 경도는 필수입니다`);
    }
    if (spots[i].latitude < -90 || spots[i].latitude > 90) {
      throw new BadRequestError(`스팟 ${spots[i].title}의 위도가 유효하지 않습니다`);
    }
    if (spots[i].longitude < -180 || spots[i].longitude > 180) {
      throw new BadRequestError(`스팟 ${spots[i].title}의 경도가 유효하지 않습니다`);
    }

    await validateSpotImages(spots[i].photos);
  }
};

export async function validateSpotCategory(
  categoryId: number | undefined
) : Promise<void> {
  if (!categoryId) {
    throw new BadRequestError("카테고리는 필수입니다");
  }

  if (isNaN(categoryId)) {
    throw new BadRequestError("유효하지 않은 카테고리입니다. 카테고리는 정수값이어야 합니다");
  }

  let queryResult: ISelectionCategoryQueryResultRow[];
  try {
    queryResult = await dbConnectionPool('spot_category')
      .where('spot_category_id', categoryId);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('카테고리를 확인하는데 실패했습니다');
  }
  
  if (queryResult.length === 0) {
    throw new BadRequestError("유효하지 않은 카테고리입니다. 카테고리가 존재하지 않습니다");
  }
}

export async function validateSpotImages(
  photos: Array<string | File> | undefined
) : Promise<void> {
  if (!photos) {
    throw new BadRequestError("사진은 필수입니다");
  }

  if (!Array.isArray(photos)) {
    throw new BadRequestError("유효하지 않은 사진입니다. 사진은 배열이어야 합니다");
  }

  if (photos.length > 4) {
    throw new BadRequestError("최대 4개의 사진만 허용됩니다");
  }
  for (const photo of photos) {
    if (typeof photo !== "string" && !(photo instanceof File)) {
      throw new BadRequestError(`유효하지 않은 사진입니다. 사진은 파일 또는 문자열(URL)이어야 합니다`);
    }
    if (photo instanceof File) {
      await validateImg(photo as File);
    } else {
      // check for invalid characters in the file name
      const imageFileName = photo as string;
      if (imageFileName.includes('/')) {
        throw new BadRequestError(`파일 이름에 / 문자가 포함되어 있습니다.`);
      }
      if (imageFileName.includes('..')) {
        throw new BadRequestError(`파일 이름에 .. 문자가 포함되어 있습니다.`);
      }
      if (imageFileName.includes('\\')) {
        throw new BadRequestError(`파일 이름에 \\ 문자가 포함되어 있습니다.`);
      }

      try {
        const imgPath : string = path.join(
          '.', 
          'public', 
          'images', 
          'selections', 
          'spots', 
          imageFileName
        );
        await checkIfDirectoryOrFileExists(imgPath);
      } catch (error) {
        console.error(error);
        throw new BadRequestError(`유효하지 않은 사진입니다. 사진이 존재하지 않습니다`);
      }
    }
  }
}

export async function validateHashtags(
  hashtags: string[] | undefined
) : Promise<void> {
  if (!hashtags) {
    throw new BadRequestError("해시태그는 필수입니다");
  }
  if (!Array.isArray(hashtags)) {
    throw new BadRequestError("무효한 해시태그입니다. 해시태그는 배열이어야 합니다");
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
  });
};

export async function validateStatus(selectionStatus: string) : Promise<void> {
  if (!SELECTION_STATUS.includes(selectionStatus)) {
    throw new BadRequestError("유효하지 않은 상태입니다");
  }
}

export async function validateData(data: ISelectionCreateFormData) : Promise<void> {
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
};