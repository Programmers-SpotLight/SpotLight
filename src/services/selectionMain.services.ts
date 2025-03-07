import { dbConnectionPool } from "@/libs/db";

export const getPopularSelection = async () => {
  try {
    const filteredSelectionsQuery = dbConnectionPool("selection")
      .select("selection.slt_id")
      .whereNotIn("selection.slt_status", ["private", "delete"])
      .as("FilteredSelections");

    const topSltIdsQuery = dbConnectionPool("bookmark")
      .select("bookmark.slt_id")
      .count("* as bookmark_count")
      .groupBy("bookmark.slt_id")
      .orderBy("bookmark_count", "desc")
      .limit(4)
      .join(
        filteredSelectionsQuery,
        "bookmark.slt_id",
        "=",
        "FilteredSelections.slt_id"
      )
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
      .join(topSltIdsQuery, "selection.slt_id", "=", "TopSltIds.slt_id");

    const results = await query;

    return results;
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to fetch search Result`);
  }
};

export const serviceRecommendationSelection = async (userId: number) => {
  try {
    const userBookmarkSubquery = dbConnectionPool('bookmark')
      .select('slt_id')
      .where('user_id', userId)
      .as('ub');

    const query = dbConnectionPool("user_selection_recommendation")
      .select(
        "selection.*",
        "user.user_nickname",
        "user.user_img",
        "selection_category.slt_category_name",
        "selection_location_option.slt_location_option_name",
        dbConnectionPool.raw(
          'JSON_ARRAYAGG(JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type)) AS slt_hashtags'
        ),
        dbConnectionPool.raw('IF(ub.slt_id IS NOT NULL, TRUE, FALSE) AS is_bookmarked')
      )
      .leftJoin("selection", "user_selection_recommendation.slt_id", "=", "selection.slt_id")
      .leftJoin("user", "selection.user_id", "=", "user.user_id")
      .leftJoin(
        "selection_category",
        "selection.slt_category_id",
        "=",
        "selection_category.slt_category_id"
      )
      .leftJoin(
        "selection_location_option",
        "selection.slt_location_option_id",
        "=",
        "selection_location_option.slt_location_option_id"
      )
      .leftJoin("selection_hashtag", "selection.slt_id", "=", "selection_hashtag.slt_id")
      .leftJoin("hashtag", "selection_hashtag.htag_id", "=", "hashtag.htag_id")
      .leftJoin(userBookmarkSubquery, "selection.slt_id", "=", "ub.slt_id")
      .where("user_selection_recommendation.user_id", userId)
      .whereNotIn("selection.slt_status", ["private", "delete"])
      .groupBy("selection.slt_id") 
      .orderByRaw('RAND()')
      .limit(6); 

    const results = await query;

    return results;
  } catch (error) {
    throw new Error(`Failed to fetch search Result: ${error}`); 
  }
};



export const serviceRandomSelection = async () => {
  try {
    const query = dbConnectionPool("selection")
      .distinct("selection.slt_id")
      .select(
        "selection.*",
        "user.user_nickname",
        "user.user_img",
        "selection_category.slt_category_name",
        "selection_location_option.slt_location_option_name",
        dbConnectionPool.raw(
          'JSON_ARRAYAGG(JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type)) AS slt_hashtags'
        )
      )
      .leftJoin("user", "selection.user_id", "=", "user.user_id")
      .leftJoin(
        "selection_hashtag",
        "selection.slt_id",
        "=",
        "selection_hashtag.slt_id"
      )
      .leftJoin(
        "selection_category",
        "selection.slt_category_id",
        "=",
        "selection_category.slt_category_id"
      )
      .leftJoin(
        "selection_location_option",
        "selection.slt_location_option_id",
        "=",
        "selection_location_option.slt_location_option_id"
      )
      .leftJoin("hashtag", "selection_hashtag.htag_id", "=", "hashtag.htag_id")
      .whereNotIn("selection.slt_status", ["private", "delete"])
      .groupBy("selection.slt_id")
      .orderByRaw('RAND()')
      .limit(6);

    const results = await query;
    
    return results;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch search Result`);
  }
};

export const serviceLoginRandomSelection = async (userId : number) => {
  try {
    
    const userBookmarkSubquery = dbConnectionPool('bookmark')
    .select('slt_id')
    .where('user_id', userId)
    .as('ub');

    const query = dbConnectionPool("selection")
      .distinct("selection.slt_id")
      .select(
        "selection.*",
        "user.user_nickname",
        "user.user_img",
        "selection_category.slt_category_name",
        "selection_location_option.slt_location_option_name",
        dbConnectionPool.raw(
          'JSON_ARRAYAGG(JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type)) AS slt_hashtags'
        ),
        dbConnectionPool.raw('IF(ub.slt_id IS NOT NULL, TRUE, FALSE) AS is_bookmarked')
      )
      .leftJoin("user", "selection.user_id", "=", "user.user_id")
      .leftJoin(
        "selection_hashtag",
        "selection.slt_id",
        "=",
        "selection_hashtag.slt_id"
      )
      .leftJoin(
        "selection_category",
        "selection.slt_category_id",
        "=",
        "selection_category.slt_category_id"
      )
      .leftJoin(
        "selection_location_option",
        "selection.slt_location_option_id",
        "=",
        "selection_location_option.slt_location_option_id"
      )
      .leftJoin("hashtag", "selection_hashtag.htag_id", "=", "hashtag.htag_id")
      .leftJoin(userBookmarkSubquery, "selection.slt_id", "=", "ub.slt_id")
      .whereNotIn("selection.slt_status", ["private", "delete"])
      .groupBy("selection.slt_id")
      .orderByRaw('RAND()')
      .limit(6);

    const results = await query;
    
    return results;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch search Result`);
  }
};
