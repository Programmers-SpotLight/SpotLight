import { IAutoCompleteRecommendTagResult } from "@/app/api/selections/search/tag-recommend/route";
import { dbConnectionPool } from "@/libs/db";
import { TsortType } from "@/models/searchResult.model";

const searchQueryBuilder = (
  queryBuilder: any,
  category_id: string,
  region_id: string,
  tags: string[],
  sort?: TsortType
) => {
  try {
    const bookmarkCountSubquery = dbConnectionPool('bookmark')
    .select('slt_id')
    .count('slt_id as bookmark_count')
    .groupBy('slt_id')
    .as('bc');
    
    queryBuilder
    .join("user", "selection.user_id", "=", "user.user_id")
    .leftJoin(bookmarkCountSubquery, 'selection.slt_id', '=', 'bc.slt_id')
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
    .join("hashtag", "selection_hashtag.htag_id", "=", "hashtag.htag_id");

  if (category_id !== "0") {
    queryBuilder.where("selection.slt_category_id", category_id);
  }

  if (region_id !== "0") {
    queryBuilder.where("selection.slt_location_option_id", region_id);
  }

  if (tags.length > 0) {
    tags.forEach((tag) => {
      queryBuilder.havingRaw(
        `SUM(CASE WHEN hashtag.htag_name LIKE '%${tag}%' THEN 1 ELSE 0 END) > 0`
      );
    });
  }

  if (sort) {
    if (sort === "latest") {
      queryBuilder.orderBy("selection.slt_created_date", "desc");
    } else if (sort === "asc") {
      queryBuilder.orderBy("selection.slt_title", "asc");
    } else if (sort === "popular") {
      queryBuilder.orderBy("bookmark_count", "desc");
    }
  }

  queryBuilder.where("selection.slt_status", "<>", "private");
  queryBuilder.where("selection.slt_status", "<>", "delete");

  return queryBuilder;
} catch(error) {
  console.log("쿼리빌더 에러", error)
}
};

export const getSearchResultCount = async (
  category_id: string,
  region_id: string,
  tags: string[],
  sort: TsortType
) => {
  try {
    const countQuery = await dbConnectionPool("selection")
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
      .select(dbConnectionPool.raw('COALESCE(bc.bookmark_count, 0) AS bookmark_count')) // bookmark 개수 추가
      .groupBy("selection.slt_id", "user.user_id")
      .modify((queryBuilder) =>
        searchQueryBuilder(queryBuilder, category_id, region_id, tags, sort)
      );

    return countQuery;
  } catch (error) {
    console.log("카운트 쿼리 에러", error)
    throw new Error(`Failed to fetch search Result`); // Todo : Error 처리
  }
};

export const getSearchResult = async (
  category_id: string,
  region_id: string,
  tags: string[],
  sort: TsortType,
  limit: number,
  currentPage: number
) => {
  try {
    const resultQuery = dbConnectionPool("selection")
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
      .select(dbConnectionPool.raw('COALESCE(bc.bookmark_count, 0) AS bookmark_count'))
      .groupBy("selection.slt_id", "user.user_id")
      .modify((queryBuilder) =>
        searchQueryBuilder(
          queryBuilder,
          category_id,
          region_id,
          tags,
          sort as TsortType
        )
      )
      .limit(limit)
      .offset((currentPage - 1) * limit);
    return resultQuery;
  } catch (error) {
    throw new Error(`Failed to fetch search Result`); // Todo : Error 처리
  }
};

export const getAutoCompleteResult = async (tagValue: string) => {
  try {
    const searchQuery = dbConnectionPool("hashtag")
      .distinct("htag_name")
      .select("htag_name")
      .where("htag_name", "like", `${tagValue}%`)
      .limit(7);

    return searchQuery;
  } catch (error) {
    throw new Error(`Failed to fetch search Result`); // Todo : Error 처리

  }
};

export const getAutoCompleteRecommendTag = async () : Promise<IAutoCompleteRecommendTagResult[]>=> {
  try {
    const recommendedTags = await dbConnectionPool("selection_hashtag")
      .join("hashtag", "selection_hashtag.htag_id", "hashtag.htag_id")
      .select("hashtag.htag_name", "hashtag.htag_id", "hashtag.htag_type")
      .count("* as reference_count") // 카운트
      .groupBy("hashtag.htag_name", "hashtag.htag_id", "hashtag.htag_type")
      .orderBy("reference_count", "desc")
      .limit(8);

    return recommendedTags as unknown as IAutoCompleteRecommendTagResult[];
  } catch (error) {
    throw new Error(`Failed to fetch recommended tags: ${error}`); // 에러 메시지 개선
  }
};