import { dbConnectionPool } from "@/libs/db";
import { TsortType } from "@/models/searchResult.model";
import { TuserSelection } from "@/models/user.model";

const userSelectionQueryBuilder = async (
  queryBuilder: any,
  userSelectionType: TuserSelection,
  userId: string,
  sort?: TsortType,
  isMyPage?: boolean,
  session_userId? : number
) => {
  const bookmarkCountSubquery = dbConnectionPool('bookmark')
  .select('slt_id')
  .count('slt_id as bookmark_count')
  .groupBy('slt_id')
  .as('bc');

  let userBookmarkSubquery;
  if (session_userId) {
    userBookmarkSubquery = dbConnectionPool('bookmark')
      .select('slt_id')
      .where('user_id', session_userId)
      .as('ub');
  }

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

  if (sort) {
    if (sort === "latest") {
      queryBuilder.orderBy("selection.slt_created_date", "desc");
    } else if (sort === "asc") {
      queryBuilder.orderBy("selection.slt_title", "asc");
    } else if (sort === "popular") {
      queryBuilder.orderBy("bookmark_count", "desc");
    }
  }

  if (userSelectionType) {
    if (userSelectionType === "my") {
      queryBuilder.where("selection.user_id", userId);
    } else if (userSelectionType === "bookmark") {
      queryBuilder
        .innerJoin("bookmark as b", "b.slt_id", "selection.slt_id")
        .where("b.user_id", userId);
    }
  }
  
  if (session_userId) {
    queryBuilder.leftJoin(userBookmarkSubquery, 'selection.slt_id', '=', 'ub.slt_id');
    queryBuilder.select(dbConnectionPool.raw('CASE WHEN ub.slt_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_bookmarked'));
  } else {
    queryBuilder.select(dbConnectionPool.raw('FALSE AS is_bookmarked'));
  }

  if (!isMyPage) {
    queryBuilder.whereNot("selection.slt_status", "private");
  }
  queryBuilder.whereNot("selection.slt_status", "delete");
  return queryBuilder;
};

export const getUserSelectionQueryCount = async (
  userSelectionType: TuserSelection,
  userId: string,
  sort?: TsortType,
  isMyPage?: boolean
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
        userSelectionQueryBuilder(
          queryBuilder,
          userSelectionType,
          userId,
          sort,
          isMyPage
        )
      );

    return countQuery;
  } catch (error) {
    throw new Error(`Failed to fetch search Result`); // Todo : Error 처리
  }
};

export const getUserSelectionResult = async (
  userSelectionType: TuserSelection,
  userId: string,
  limit: number,
  currentPage: number,
  sort?: TsortType,
  session_userId? : number,
  isMyPage?: boolean
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
      .select(dbConnectionPool.raw('COALESCE(bc.bookmark_count, 0) AS bookmark_count')) // bookmark 개수 추가
      .groupBy("selection.slt_id", "user.user_id")
      .modify((queryBuilder) =>
        userSelectionQueryBuilder(
          queryBuilder,
          userSelectionType,
          userId,
          sort,
          isMyPage,
          session_userId
        )
      )
      .limit(limit)
      .offset((currentPage - 1) * limit);
    return resultQuery;
  } catch (error) {
    throw new Error(`Failed to fetch search Result`);
  }
};

export const getUserTempSelectionCount = async (userId: string) => {
  try {
    const countQuery = await dbConnectionPool("selection_temporary")
      .select("*")
      .where("selection_temporary.user_id", userId);
    return countQuery;
  } catch (error) {
    throw new Error(`Failed to fetch search Result`);
  }
};

export const getUserTempSelection = async (
  userId: string,
  currentPage: number,
  limit: number
) => {
  try {
    const offset = (currentPage - 1) * limit;
    const resultQuery = await dbConnectionPool("selection_temporary")
      .select(
        "selection_temporary.*",
        "user.user_nickname",
        "selection_category.slt_category_name",
        "selection_location_option.slt_location_option_name"
      )
      .where("selection_temporary.user_id", userId)
      .leftJoin("user", "selection_temporary.user_id", "=", "user.user_id") 
      .leftJoin(
        "selection_category",
        "selection_temporary.slt_category_id",
        "=",
        "selection_category.slt_category_id"
      ) 
      .leftJoin(
        "selection_location_option",
        "selection_temporary.slt_location_option_id",
        "=",
        "selection_location_option.slt_location_option_id"
      )
      .limit(limit)
      .offset(offset);
    return resultQuery;
  } catch (error) {
    throw new Error(`Failed to fetch search Result`);
  }
};

export const servicePutUserSelectionPrivate = async (userId: string, selectionId: number) => {
  try {
    await dbConnectionPool('selection')
    .where({
      slt_id: selectionId,
      user_id: userId
    })
    .update({
      slt_status: dbConnectionPool.raw(`CASE WHEN slt_status = 'private' THEN 'public' ELSE 'private' END`)
    });
  } catch (error) {
    throw new Error(`Failed to update user selection status: ${error}`);
  }
};

export const serviceDeleteSelection = async (userId: string, selectionId: number) => {
  try {
    await dbConnectionPool('selection')
      .where({
        slt_id: selectionId,
        user_id: userId
      })
      .update({
        slt_status: 'delete'
      });
  } catch (error) {
    throw new Error(`Failed to update user selection status: ${error}`);
  }
};

export const serviceDeleteTempSelection = async (userId: string, selectionId: number) => {
  try { 
    await dbConnectionPool('selection_temporary')
      .where({
        slt_temp_id: selectionId,
        user_id: userId
      })
      .del();
  } catch (error) {
    throw new Error('임시 선택 데이터를 삭제하는 중 오류가 발생했습니다.');
  }
};
