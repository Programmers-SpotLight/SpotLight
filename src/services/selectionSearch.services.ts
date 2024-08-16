import { dbConnectionPool } from "@/libs/db";
import { TsortType } from "@/models/searchResult.model";

const searchQueryBuilder = (
  queryBuilder: any,
  category_id: string,
  region_id: string,
  tags: string[],
  sort?: TsortType
) => {
  queryBuilder
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
      // Todo : 인기 순 리뷰 기능 구현 시 추가 구현
    }
  }

  queryBuilder.where("selection.slt_status", "<>", "private");
  queryBuilder.where("selection.slt_status", "<>", "delete");

  return queryBuilder;
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
      .groupBy("selection.slt_id", "user.user_id")
      .modify((queryBuilder) =>
        searchQueryBuilder(queryBuilder, category_id, region_id, tags, sort)
      );

    return countQuery;
  } catch (error) {
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