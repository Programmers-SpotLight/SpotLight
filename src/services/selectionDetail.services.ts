import { dbConnectionPool } from "@/libs/db";
import { Ihashtags } from "@/models/hashtag.model";
import { ISelectionDetailInfo } from "@/models/selection.model";
import { ISpotInfo } from "@/models/spot.model";

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
      .leftJoin(
        "selection_location_option",
        "selection.slt_location_option_id",
        "selection_location_option.slt_location_option_id"
      )
      .select(
        "selection.slt_id as id",
        "selection.slt_title as title",
        "selection.slt_img as image",
        "selection.slt_description as description",
        "selection.slt_status as status",
        "selection.slt_created_date as createdAt",
        "selection.slt_updated_date as updatedAt",
        "selection_category.slt_category_id as categoryId",
        "selection_category.slt_category_Name as categoryName",
        "selection_location_option.slt_location_option_name as location"
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

      let hashtags = await dbConnectionPool("hashtag")
        .select(
          dbConnectionPool.raw(
            `JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type) as hashtags`
          )
        )
        .whereIn("htag_id", htagIdArray);

      hashtags = hashtags.map((item) =>
        typeof item.hashtags === "string"
          ? (JSON.parse(item.hashtags) as Ihashtags[])
          : item.hashtags
      );
      return hashtags;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(`Failed to fetch selection ${selectionId} hashtags`);
  }
};

export const getSpotDetailInfo = async (selectionId: number) => {
  try {
    const spotData: ISpotInfo[] = await dbConnectionPool("spot")
      .leftJoin(
        "spot_category",
        "spot.spot_category_id",
        "spot_category.spot_category_id"
      )
      .select(
        "spot_id as id",
        "spot_title as title",
        "spot_description as description",
        "spot_gmap_address as address",
        "spot_gmap_latitude as lat",
        "spot_gmap_longitude as lng",
        "spot_updated_date as updatedDate",
        "spot_created_date as createdDate",
        "spot_gmap_id as gmapId",
        "spot_category.spot_category_id as categoryId",
        "spot_category.spot_category_name as categoryName",
        "spot_order as order"
      )
      .where("spot.slt_id", selectionId);

    return spotData;
  } catch (error) {
    throw new Error(`Failed to fetch selection ${selectionId}'s spots`);
  }
};

export const getSpotHashTags = async (spotId: Buffer) => {
  try {
    const hashtagIds = await dbConnectionPool("spot_hashtag")
      .select("htag_id")
      .where("spot_id", spotId);

    if (hashtagIds.length > 0) {
      const htagIdArray = hashtagIds.map((item) => item.htag_id);

      let hashtags = await dbConnectionPool("hashtag")
        .select(
          dbConnectionPool.raw(
            `JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type) as hashtags`
          )
        )
        .whereIn("htag_id", htagIdArray);

      hashtags = hashtags.map((item) =>
        typeof item.hashtags === "string"
          ? (JSON.parse(item.hashtags) as Ihashtags[])
          : item.hashtags
      );
      return hashtags;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(`Failed to fetch spot ${spotId}'s hashtags`);
  }
};

export const getSpotImages = async (spotId: Buffer) => {
  try {
    const spotImages = await dbConnectionPool("spot_image")
      .select("spot_img_url as url", "spot_img_order as order")
      .where("spot_id", spotId);

    if (!spotImages) return [];
    else return spotImages;
  } catch (error) {
    throw new Error(`Failed to fetch spot ${spotId}'s images`);
  }
};

export const getBookMarks = async (selectionId: number, userId: number) => {
  try {
    const bookmarks = await dbConnectionPool("bookmark")
      .select("*")
      .where("slt_id", selectionId)
      .andWhere("user_id", userId);
    return bookmarks;
  } catch (error) {
    throw new Error("Failed to getBookMarks");
  }
};

export const getSpotCategories = async (spotId: string) => {
  try {
    const SpotCategory = await dbConnectionPool();
  } catch (error) {}
};
