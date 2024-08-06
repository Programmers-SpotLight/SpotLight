// 공통 쿼리 빌더 함수
export const searchQueryBuilder = (
  queryBuilder: any,
  category_id: string,
  tags: string[]
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
    .join("hashtag", "selection_hashtag.htag_id", "=", "hashtag.htag_id");

  if (category_id !== "0") {
    queryBuilder.where("selection.slt_category_id", category_id);
  }

  if (tags.length > 0) {
    queryBuilder.havingRaw(
      `SUM(CASE WHEN ${tags
        .map((tag) => `hashtag.htag_name LIKE '%${tag}%'`)
        .join(" OR ")} THEN 1 ELSE 0 END) > 0`
    );
  }

  return searchQueryBuilder;
};
