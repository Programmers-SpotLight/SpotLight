import { dbConnectionPool } from "@/libs/db";
import { TsortType } from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";

const userSelectionQueryBuilder = async (
    queryBuilder: any,
    userSelectionType: TuserSelection,
    userId : string,
    sort?: TsortType,
) => {
    queryBuilder.join("user", "selection.user_id", "=", "user.user_id")
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
      
      if (sort) {
        if (sort === "latest") {
          queryBuilder.orderBy("selection.slt_created_date", "desc");
        } else if (sort === "asc") {
          queryBuilder.orderBy("selection.slt_title", "asc");
        } else if (sort === "popular") {
          // Todo : 인기 순 리뷰 기능 구현 시 추가 구현
        }
      }

      if (userSelectionType) {
        if (userSelectionType === "my") {
            queryBuilder.where("selection.user_id", userId); // 수정된 부분
    
        } else if (userSelectionType === "bookmark") {
            queryBuilder
            .innerJoin("bookmark as b", "b.slt_id", "selection.slt_id")
            .where("b.user_id", userId); // user_id를 올바르게 참조
    
        } else if (userSelectionType === "temp") {
            // temp에 대한 처리 추가 필요
        }
    }
    return queryBuilder
}

export const getUserSelectionQueryCount = async (
    userSelectionType: TuserSelection,
    userId : string,
    sort?: TsortType,
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
          userSelectionQueryBuilder(queryBuilder, userSelectionType, userId, sort)
        );
  
      return countQuery;
    } catch (error) {
      throw new Error(`Failed to fetch search Result`); // Todo : Error 처리
    }
  };

export const getUserSelectionResult = async (
    userSelectionType: TuserSelection,
    userId : string,
    limit : number,
    currentPage : number,
    sort?: TsortType,
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
            userSelectionQueryBuilder(
              queryBuilder,
              userSelectionType,
              userId,
              sort
            )
          )
          .limit(limit)
          .offset((currentPage - 1) * limit);
        return resultQuery;
      } catch (error) {
        throw new Error(`Failed to fetch search Result`);
      }

}