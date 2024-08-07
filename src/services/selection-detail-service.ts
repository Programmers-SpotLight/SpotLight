import { dbConnectionPool } from "@/libs/db";
import { ISelectionDetailInfo } from "@/models/selection";
import { ISpotDetail } from "@/models/spot";

export const getSelectionDetailInfo = async (selectionId: number) => {
  try {
    const selectionData: ISelectionDetailInfo = await dbConnectionPool(
      "selection"
    )
      .leftJoin(
        "selection_category",
        "selection.slt_category_id",
        "selection_category.slt_category_id"
      )
      .select(
        "selection.slt_id as id",
        "selection.slt_title as title",
        "selection.slt_img as image",
        "selection.slt_description as description",
        "selection.slt_status as status",
        "selection.slt_created_date as createdAt",
        "selection.slt_updated_date as updatedAt",
        dbConnectionPool.raw(`
          JSON_OBJECT(
            'id', selection_category.slt_category_id,
            'name', selection_category.slt_category_name
          ) AS category
        `)
      )
      .where("selection.slt_id", selectionId)
      .first();

    return selectionData;
  } catch (error) {
    throw new Error(`Failed to fetch selection ${selectionId} information`);
  }
};

export const getSelectionHashTags = async (selectionId: number) => {
  try {
    const hashtagIds = await dbConnectionPool("selection_hashtag")
      .select("htag_id")
      .where("slt_id", selectionId);

    if (hashtagIds.length > 0) {
      const htagIdArray = hashtagIds.map((item) => item.htag_id);

      const hashtags = await dbConnectionPool("hashtag")
        .select("htag_name as hashtags")
        .whereIn("htag_id", htagIdArray);

      return hashtags.map((tag) => tag.hashtags);
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(`Failed to fetch selection ${selectionId} hashtags`);
  }
};

export const getSpotDetailInfo = async (selectionId: number) => {
  try {
    const spotData: ISpotDetail[] = await dbConnectionPool("spot")
      .select(
        "spot_id as id",
        "spot_title as title",
        "spot_description as description",
        "spot_gmap_address as address",
        "spot_gmap_latitude as lat",
        "spot_gmap_longitude as lng",
        "spot_updated_date as updatedDate",
        "spot_created_date as createdDate",
        "spot_gmap_id as gmapId"
      )
      .where("spot.slt_id", selectionId);

    if (!spotData.length) return [];
    else return spotData;
  } catch (error) {
    throw new Error(`Failed to fetch selection ${selectionId}'s spots`);
  }
};

export const getSpotHashTags = async (spotId: string) => {
  try {
    const hashtagIds = await dbConnectionPool("spot_hashtag")
      .select("htag_id")
      .where("spot_id", spotId);

    if (hashtagIds.length > 0) {
      const htagIdArray = hashtagIds.map((item) => item.htag_id);

      const hashtags = await dbConnectionPool("hashtag")
        .select("htag_name as hashtags")
        .whereIn("htag_id", htagIdArray);

      return hashtags.map((tag) => tag.hashtags);
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(`Failed to fetch spot ${spotId}'s hashtags`);
  }
};

export const getSpotImages = async (spotId: string) => {
  try {
    const spotImages = await dbConnectionPool("spot_image")
      .select("spot_img_url as image", "spot_img_order as order")
      .where("spot_id", spotId);

    if (!spotImages) return [];
    else return spotImages;
  } catch (error) {
    throw new Error(`Failed to fetch spot ${spotId}'s images`);
  }
};

export const getSpotCategories = async (spotIds: string[]) => {};
