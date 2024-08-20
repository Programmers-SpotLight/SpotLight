import { ISelectionCreateCompleteData, ISelectionCreateTemporaryData } from "@/models/selection.model";
import { 
  deleteMultipleSelectionHashtagNotIn,
  deleteMultipleTemporarySelectionHashtagNotIn,
  insertHashtagsGetIds,
  insertSelectionHashtags,
  insertTemporarySelectionHashtags,
  selectMultipleSelectionHashtags, 
  selectMultipleSpotHashtagBySelectionId, 
  selectMultipleSpotTemporaryHashtagBySelectionId, 
  selectMultipleTemporarySelectionHashtags 
} from "@/repositories/hashtag.repository";
import { 
  selectSelectionWhereIdEqual, 
  selectTemporarySelectionWhereIdEqual, 
  updateSelectionWhereIdEqual, 
  updateTemporarySelectionWhereIdEqual
} from "@/repositories/selection.repository";
import { 
  selectMultipleSpotBySelectionId, 
  selectMultipleSpotImageBySelectionId, 
  selectMultipleSpotTemporaryBySelectionId, 
  selectMultipleSpotTemporaryImageBySelectionId
} from "@/repositories/spot.repository";
import { NotFoundError } from "@/utils/errors";
import { createHashtagsForSpots, saveSelectionImage } from "./selectionCreate.services";
import { Knex } from "knex";
import { upsertSpots, upsertTemporarySpots } from "./spot.services";


export async function getTemporarySelectionForEdit(
  selectionId: number
) {
  const selection = await selectTemporarySelectionWhereIdEqual(selectionId);
  if (!selection) {
    throw new NotFoundError("해당 셀렉션을 찾을 수 없습니다");
  }

  selection.hashtags = (await selectMultipleTemporarySelectionHashtags(selectionId)).map(
    (hashtag) => hashtag.name
  );

  const spots = await selectMultipleSpotTemporaryBySelectionId(selectionId);
  const spotIds = spots.map((spot) => spot.id);

  if (spotIds.length === 0) {
    selection.spots = [];
    return selection;
  }

  const spotImages = await selectMultipleSpotTemporaryImageBySelectionId(selectionId);
  spotImages.forEach((spotImage) => {
    const spot = spots.find((spot) => spot.id === spotImage.spotId);
    if (spot) {
      spot.images.push(spotImage.imageUrl);
    }
  });

  const spotHashtags = await selectMultipleSpotTemporaryHashtagBySelectionId(selectionId);
  spotHashtags.forEach((spotHashtag) => {
    const spot = spots.find((spot) => spot.id === spotHashtag.spotId);
    if (spot) {
      spot.hashtags.push(spotHashtag.name);
    }
  });

  selection.spots = spots;
  return selection;
}

export async function getSelectionForEdit(
  selectionId: number
) {
  const selection = await selectSelectionWhereIdEqual(selectionId);
  if (!selection) {
    throw new NotFoundError("해당 셀렉션을 찾을 수 없습니다");
  }

  selection.hashtags = (await selectMultipleSelectionHashtags(selectionId)).map(
    (hashtag) => hashtag.name
  );

  const spots = await selectMultipleSpotBySelectionId(selectionId);

  const spotsImages = await selectMultipleSpotImageBySelectionId(selectionId);
  spotsImages.forEach((spotImage) => {
    const spot = spots.find((spot) => spot.id === spotImage.spotId);
    if (spot) {
      spot.images.push(spotImage.imageUrl);
    }
  });

  const spotsHashtags = await selectMultipleSpotHashtagBySelectionId(selectionId);
  spotsHashtags.forEach((spotHashtag) => {
    const spot = spots.find((spot) => spot.id === spotHashtag.spotId);
    if (spot) {
      spot.hashtags.push(spotHashtag.name);
    }
  });

  selection.spots = spots;
  return selection;
}

export async function editSelection(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  formData: ISelectionCreateCompleteData
) {
  const selection = await selectSelectionWhereIdEqual(selectionId);
  if (!selection) {
    throw new NotFoundError("해당 셀렉션을 찾을 수 없습니다");
  }

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

  await updateSelectionWhereIdEqual(
    transaction, 
    selectionId, 
    {
      slt_title: formData.title,
      slt_status: formData.status,
      slt_category_id: formData.category,
      slt_location_option_id: formData.location.subLocation,
      slt_description: formData.description,
      slt_img: formData.img
    }
  );

  if (formData.hashtags && formData.hashtags.length > 0) {
    await insertSelectionHashtags(
      transaction, 
      selectionId, 
      formData.hashtags as number[]
    );

    await deleteMultipleSelectionHashtagNotIn(
      transaction, 
      selectionId, 
      formData.hashtags as number[]
    );
  }

  if (formData.spots && formData.spots.length > 0) {
    await upsertSpots(
      transaction, 
      selectionId, 
      formData.spots
    );
  }
}

export async function editSelectionTemporary(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  formData: ISelectionCreateTemporaryData
) {
  const selection = await selectTemporarySelectionWhereIdEqual(selectionId);
  if (!selection) {
    throw new NotFoundError("해당 셀렉션을 찾을 수 없습니다");
  }

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

  await updateTemporarySelectionWhereIdEqual(
    transaction, 
    selectionId, 
    {
      slt_temp_title: formData.title,
      slt_category_id: formData.category || null,
      slt_location_option_id: formData.location?.subLocation || null,
      slt_temp_description: formData.description || null,
      slt_temp_img: formData.img || null
    }
  );

  if (formData.hashtags && formData.hashtags.length > 0) {
    await insertTemporarySelectionHashtags(
      transaction, 
      selectionId, 
      formData.hashtags as number[]
    );

    await deleteMultipleTemporarySelectionHashtagNotIn(
      transaction, 
      selectionId, 
      formData.hashtags as number[]
    );
  }

  if (formData.spots && formData.spots.length > 0) {
    await upsertTemporarySpots(
      transaction, 
      selectionId, 
      formData.spots
    );
  }
}