import { SELECTION_STATUS } from "@/constants/selection.constants";
import { ISelectionCategoryQueryResultRow, ISelectionCreateCompleteData, ISelectionCreateFormData, ISelectionCreateTemporaryData, ISelectionLocationQueryResultRow, ISelectionSpot, TSelectionCreateFormData } from "@/models/selection.model";
import { selectAllSelectionCategoriesWhereIdIn, selectAllSelectionLocationOptionsWhereIdIn, selectAllSelectionWhereImageEqual } from "@/repositories/selection.repository";
import { BadRequestError, InternalServerError } from "@/utils/errors";
import { checkIfDirectoryOrFileExists } from "@/utils/fileStorage";
import { fileTypeFromBlob } from "file-type";
import path from "path/posix";

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
      const queryResult = await selectAllSelectionWhereImageEqual(img);

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
