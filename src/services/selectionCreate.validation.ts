import { SELECTION_STATUS } from "@/constants/selection.constants";
import { checkIfFileExistsInS3 } from "@/libs/s3";
import { 
  ISelectionCategoryQueryResultRow, 
  ISelectionCreateCompleteData, 
  ISelectionCreateTemporaryData, 
  ISelectionLocationQueryResultRow, 
  ISelectionSpot, 
  TSelectionCreateFormData 
} from "@/models/selection.model";
import { 
  selectAllSelectionCategoriesWhereIdIn, 
  selectAllSelectionLocationOptionsWhereIdIn, 
  selectTemporarySelectionWhereIdEqual
} from "@/repositories/selection.repository";
import { BadRequestError, InternalServerError } from "@/utils/errors";
import { extractFileNameFromS3Url } from "@/utils/fileStorage";
import { fileTypeFromBlob } from "file-type";


export async function prepareAndValidateSelectionCreateFormData(
  formData: FormData
) : Promise<ISelectionCreateCompleteData> {
  let data: ISelectionCreateCompleteData = {
    temp_id: Number(formData.get("temp_id")) || undefined,
    title: String(formData.get("title")),
    status: String(formData.get("status")) as "public" | "private",
    img: formData.get("img") as File | string,
    category: Number(formData.get("category")),
    description: String(formData.get("description")),
    spots: await prepareSpots(formData),
    hashtags: await safeJSONParse(String(formData.get("hashtags"))),
    location: await safeJSONParse(String(formData.get("location"))),
  };

  await validateData(data);
  return data;
}

export async function prepareAndValidateTemporarySelectionCreateFormData(
  formData: FormData
): Promise<ISelectionCreateTemporaryData> {
  let data: ISelectionCreateTemporaryData = {
    title: formData.get("title") as string,
    status: "temp",
    img: formData.get("img") as File | string || undefined,
    category: Number(formData.get("category")) || undefined,
    description: formData.get("description") as string | undefined,
    spots: await prepareSpots(formData) || undefined,
    hashtags: await safeJSONParse(String(formData.get("hashtags"))) || undefined,
    location: await safeJSONParse(String(formData.get("location"))) || undefined,
  };

  await validateData(data);
  return data;
}

export async function validateData(data: TSelectionCreateFormData) : Promise<void> {
  await validateTitle(data.title);
  await validateStatus(data.status);

  // 미리저장이 아닌 경우 모든 필수 데이터를 검증
  if (data.status != "temp") {
    if (data.temp_id) {
      await validateTempId(data.temp_id);
    }
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

// 임시저장한 셀렉션 ID가 유효한지 확인
// 임시저장 셀렉션을 셀렉션으로 제출 시 사용하는 유효성 검사 함수
export async function validateTempId(tempId: number): Promise<void> {
  if (tempId == null) {
    throw new BadRequestError("임시저장 ID는 필수입니다");
  }

  if (isNaN(tempId)) {
    throw new BadRequestError("유효하지 않은 임시저장 ID입니다");
  }

  const queryResult = await selectTemporarySelectionWhereIdEqual(tempId);
  if (queryResult == null) {
    throw new BadRequestError("유효하지 않은 임시저장 ID입니다");
  }
}

export async function validateTitle(title: string): Promise<void> {
  if (!title) {
    throw new BadRequestError("제목은 필수입니다");
  }

  if (typeof title !== "string") {
    throw new BadRequestError("유효하지 않은 제목입니다");
  }

  if (title.length > 128) {
    throw new BadRequestError("제목은 128자 이하여야 합니다");
  }
}

export async function validateCategory(
  category: number
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
    queryResult = await selectAllSelectionCategoriesWhereIdIn([category]);
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

  if (!location.location || !location.subLocation) {
    throw new BadRequestError(
      "유효하지 않은 위치입니다. location 및 subLocation은 필수입니다"
    );
  }

  if (isNaN(location.location) || isNaN(location.subLocation)) {
    throw new BadRequestError(
      "유효하지 않은 위치입니다. location 및 subLocation은 정수값이어야 합니다"
    );
  }

  let queryResult: ISelectionLocationQueryResultRow[];
  try {
    queryResult = await selectAllSelectionLocationOptionsWhereIdIn(
      [location.location],
      [location.subLocation]
    );
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
  description: string
): Promise<void> {
  if (!description) {
    throw new BadRequestError("설명은 필수입니다");
  }

  if (typeof description !== "string") {
    throw new BadRequestError("유효하지 않은 설명입니다");
  }
}

export async function validateImg(
  img: File | string
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
    const fileName = extractFileNameFromS3Url(img);
    if (!fileName) {
      throw new BadRequestError("유효하지 않은 이미지 URL입니다");
    }
    await checkIfFileExistsInS3(fileName);
  }
}

export async function validateSpots(
  spots: ISelectionSpot[]
): Promise<void> {
  if (!spots) {
    throw new BadRequestError("스팟은 필수입니다");
  }

  if (!Array.isArray(spots)) {
    throw new BadRequestError(
      "유효하지 않은 스팟입니다. 스팟은 배열이어야 합니다"
    );
  }

  if (spots.length > 20) {
    throw new BadRequestError("최대 20개의 스팟만 허용됩니다");
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

    if (spots[i].images.length > 0) {
      await validateSpotImages(spots[i].images);
    }
  }
}

export async function validateSpotCategory(
  categoryId: number
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
    queryResult = await selectAllSelectionCategoriesWhereIdIn([categoryId]);
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
  images: Array<string | File>
): Promise<void> {
  if (!images) {
    throw new BadRequestError("사진은 필수입니다");
  }

  if (!Array.isArray(images)) {
    throw new BadRequestError(
      "유효하지 않은 사진입니다. 사진은 배열이어야 합니다"
    );
  }

  if (images.length > 4) {
    throw new BadRequestError("최대 4개의 사진만 허용됩니다");
  }

  for (const image of images) {
    if (typeof image !== "string" && !(image instanceof File)) {
      throw new BadRequestError(
        `유효하지 않은 사진입니다. 사진은 파일 또는 문자열(URL)이어야 합니다`
      );
    }
    if (image instanceof File) {
      await validateImg(image as File);
    } else {
      // check for invalid characters in the file name
      const imageFileName = image as string;
      console.log(imageFileName);
      if (imageFileName.includes("..")) {
        throw new BadRequestError(`파일 이름에 .. 문자가 포함되어 있습니다.`);
      }
      if (imageFileName.includes("\\")) {
        throw new BadRequestError(`파일 이름에 \\ 문자가 포함되어 있습니다.`);
      }

      try {
        const fileName = extractFileNameFromS3Url(imageFileName);
        if (!fileName) {
          throw new BadRequestError("유효하지 않은 사진 URL입니다");
        }

        await checkIfFileExistsInS3(fileName);
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
  hashtags: string[]
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

export async function safeJSONParse<T>(data: string) {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    throw new BadRequestError("잘못된 JSON 형식입니다");
  }
}

export async function prepareSpots(
  formData: FormData
) {
  if (!formData.has("spots")) {
    return [];
  }
  const data = await safeJSONParse<ISelectionSpot[]>(String(formData.get("spots")));
  await restoreSpotImagesToSpots(data, formData);
  return data;
}

// FormData에서 spotId에 해당하는 이미지 파일을 추출하여 반환
async function extractSpotImages(
  placeId: string,
  formData: FormData
): Promise<Array<string | File>> {
  const keys: string[] = Array.from(formData.keys()).sort();

  return keys
    .map((key) => {
      if (key.startsWith(`spots[${placeId}][images]`)) {
        return formData.get(key);
      }
      return null;
    })
    .filter((image) => image !== null);
}

async function restoreSpotImagesToSpots(
  spots: ISelectionSpot[],
  formData: FormData
): Promise<void> {
  for (let i = 0; i < spots.length; i++) {
    const images: Array<string | File> = await extractSpotImages(
      spots[i].placeId,
      formData
    );

    spots[i].images = images;
  }
}