import { dbConnectionPool } from "@/libs/db";

export const getPopularSelection = async () => {
  try {
    const topSltIdsQuery = dbConnectionPool("bookmark")
      .select("slt_id")
      .count("* as bookmark_count")
      .groupBy("slt_id")
      .orderBy("bookmark_count", "desc")
      .limit(4)
      .as("TopSltIds");

    const query = dbConnectionPool("selection")
      .distinct("selection.slt_id")
      .select(
        "selection.*",
        "user.user_nickname",
        "user.user_img",
        "selection_category.slt_category_name",
        "selection_location_option.slt_location_option_name"
      )
      .join("user", "selection.user_id", "=", "user.user_id")
      .join(
        "selection_hashtag",
        "selection.slt_id",
        "=",
        "selection_hashtag.slt_id"
      )
      .join(
        "selection_category",
        "selection.slt_category_id",
        "=",
        "selection_category.slt_category_id"
      )
      .join(
        "selection_location_option",
        "selection.slt_location_option_id",
        "=",
        "selection_location_option.slt_location_option_id"
      )
      .join(topSltIdsQuery, "selection.slt_id", "=", "TopSltIds.slt_id")
      .whereNotIn("selection.slt_status", ["private", "delete"]);

    const results = await query;
    
    return results;
  } catch (error) {
    throw new Error(`Failed to fetch search Result`); // Todo : Error 처리
  }
};
