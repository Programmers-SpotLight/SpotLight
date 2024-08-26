import { dbConnectionPool } from "@/libs/db";
import { 
  IInsertSelection, 
  IInsertSelectionTemporary, 
  ISelectionCategoryQueryResultRow, 
  ISelectionLocationQueryResultRow, 
  ISelectSelection 
} from "@/models/selection.model";
import { InternalServerError } from "@/utils/errors";
import { Knex } from "knex";


export const insertSelectionGetId = async (
  transaction: Knex.Transaction<any, any[]>,
  selection: IInsertSelection
) : Promise<number[]> => {
  const {
    user_id,
    slt_title,
    slt_status,
    slt_category_id,
    slt_location_option_id,
    slt_description,
    slt_img
  } = selection;

  try {
    return await transaction('selection')
      .insert({
        user_id,
        slt_title,
        slt_status,
        slt_category_id,
        slt_location_option_id,
        slt_description,
        slt_img      
      }, ['slt_id']);
  } catch (error : any) {
    throw new InternalServerError('셀렉션 생성에 실패했습니다');
  }
}

export const insertSelectionTemporary = async (
  transaction: Knex.Transaction<any, any[]>,
  selection: IInsertSelectionTemporary
) : Promise<number[]> => {
  const {
    user_id,
    slt_temp_title,
    slt_category_id,
    slt_location_option_id,
    slt_temp_description,
    slt_temp_img
  } = selection;

  try {
    return await transaction('selection_temporary')
      .insert({
        user_id,
        slt_temp_title,
        slt_category_id,
        slt_location_option_id,
        slt_temp_description,
        slt_temp_img      
      }, ['slt_temp_id']);
  } catch (error : any) {
    throw new InternalServerError('임시 셀렉션 생성에 실패했습니다');
  }
}

export async function sortSelectionIdByBookmarkCountDesc(
  transaction: Knex.Transaction<any, any[]>,
  selectionIds: number[]
): Promise<Array<{selectionId: number, bookmarkCount: number}>> {
  try {
    return await transaction("selection")
      .select([
        "selection.slt_id as selectionId",
        transaction.raw(`COUNT(bookmark.slt_id) as bookmarkCount`)
      ])
      .leftJoin("bookmark", "selection.slt_id", "bookmark.slt_id")
      .whereIn("selection.slt_id", selectionIds)
      .groupBy("selection.slt_id")
      .orderBy("bookmarkCount", "desc");
    
  } catch (error) {
    throw new InternalServerError('셀렉션 북마크 수로 정렬하는데 실패했습니다');
  }
}


export async function selectAllSelectionCategoriesWhereIdIn(
  categoryIds: number[]
): Promise<ISelectionCategoryQueryResultRow[]> {
  try {
    const queryResult: ISelectionCategoryQueryResultRow[] =
      await dbConnectionPool
        .column([
          "selection_category.slt_category_id as category_id",
          "selection_category.slt_category_name as category_name"
        ])
        .select()
        .from("selection_category")
        .whereIn("selection_category.slt_category_id", categoryIds);

    return queryResult;
  } catch (error) {
    throw new InternalServerError('셀렉션 카테고리를 가져오는데 실패했습니다');
  }
}

export async function selectAllSelectionLocationOptionsWhereIdIn(
  locationIds: number[],
  subLocationIds: number[]
): Promise<ISelectionLocationQueryResultRow[]> {
  try {
    const queryResult = await dbConnectionPool("selection_location_option")
      .whereIn("slt_location_id", locationIds)
      .whereIn("slt_location_option_id", subLocationIds);
    
    return queryResult;
  } catch (error) {
    throw new InternalServerError('셀렉션 지역을 가져오는데 실패했습니다');
  }
}

export async function selectAllSelectionCategories(): Promise<ISelectionCategoryQueryResultRow[]> {
  try {
    const queryResult: ISelectionCategoryQueryResultRow[] =
      await dbConnectionPool
        .column([
          "selection_category.slt_category_id as category_id",
          "selection_category.slt_category_name as category_name"
        ])
        .select()
        .from("selection_category")
        .orderBy("selection_category.slt_category_id", "asc");
    
    return queryResult;
  } catch (error) {
    throw new InternalServerError('셀렉션 카테고리를 가져오는데 실패했습니다');
  }
}

export async function selectAllSelectionLocations(): Promise<ISelectionLocationQueryResultRow[]> {
  try {
    const queryResult: ISelectionLocationQueryResultRow[] =
      await dbConnectionPool
        .column([
          "selection_location.slt_location_id as location_id",
          "selection_location.slt_location_name as location_name",
          "selection_location_option.slt_location_option_id as location_option_id",
          "selection_location_option.slt_location_option_name as location_option_name"
        ])
        .select()
        .from("selection_location")
        .join(
          "selection_location_option",
          "selection_location.slt_location_id",
          "selection_location_option.slt_location_id"
        )
        .orderBy("selection_location.slt_location_id", "asc");

    return queryResult;
  } catch (error) {
    throw new InternalServerError('셀렉션 지역을 가져오는데 실패했습니다');
  }
};

export async function selectAllSelectionWhereImageEqual(
  imageURL: string
): Promise<ISelectSelection[]> {
  try {
    const queryResult =
      await dbConnectionPool
        .column([
          "slt_title as title",
          "slt_status as status",
          "slt_category_id as categoryId",
          "slt_location_option_id as locationId",
          "slt_description as description",
          "slt_img as image"
        ])
        .select()
        .from("selection")
        .where("slt_img", imageURL);

    return queryResult;
  } catch (error) {
    throw new InternalServerError('셀렉션을 가져오는데 실패했습니다');
  }
}

export async function selectAllSelectionTemporaryWhereImageEqual(
  imageURL: string
): Promise<ISelectSelection[]> {
  try {
    const queryResult =
      await dbConnectionPool
        .column([
          "slt_temp_title as title",
          "slt_category_id as categoryId",
          "slt_location_option_id as locationId",
          "slt_temp_description as description",
          "slt_temp_img as image"
        ])
        .select()
        .from("selection_temporary")
        .where("slt_temp_img", imageURL);
    
    return queryResult;
  } catch (error) {
    throw new InternalServerError('임시 셀렉션을 가져오는데 실패했습니다');
  }
}

export async function selectSelectionWhereIdEqual(
  selectionId: number
): Promise<ISelectSelection> {
  try {
    const queryResult =
      await dbConnectionPool
        .column([
          "slt_title as title",
          "slt_status as status",
          "user_id as userId",
          "selection_category.slt_category_id as categoryId",
          "selection_category.slt_category_name as categoryName",
          "selection_location.slt_location_id as locationId",
          "selection_location.slt_location_name as locationName",
          "selection_location_option.slt_location_option_id as subLocationId",
          "selection_location_option.slt_location_option_name as subLocationName",
          "slt_description as description",
          "slt_img as image"
        ])
        .select()
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
        .leftJoin(
          "selection_location",
          "selection_location_option.slt_location_id",
          "selection_location.slt_location_id"
        )
        .from("selection")
        .where("slt_id", selectionId)
        .first();

    return queryResult;
  } catch (error) {
    throw new InternalServerError('셀렉션을 가져오는데 실패했습니다');
  }
}

export async function selectTemporarySelectionWhereIdEqual(
  selectionId: number
): Promise<ISelectSelection> {
  try {
    const queryResult =
      await dbConnectionPool("selection_temporary")
        .column([
          "slt_temp_title as title",
          "user_id as userId",
          "selection_category.slt_category_id as categoryId",
          "selection_category.slt_category_name as categoryName",
          "selection_location.slt_location_id as locationId",
          "selection_location.slt_location_name as locationName",
          "selection_location_option.slt_location_option_id as subLocationId",
          "selection_location_option.slt_location_option_name as subLocationName",
          "slt_temp_description as description",
          "slt_temp_img as image"
        ])
        .select()
        .where("slt_temp_id", '=', selectionId)
        .leftJoin(
          "selection_category", 
          "selection_temporary.slt_category_id", 
          "selection_category.slt_category_id"
        )
        .leftJoin(
          "selection_location_option", 
          "selection_temporary.slt_location_option_id", 
          "selection_location_option.slt_location_option_id"
        )
        .leftJoin(
          "selection_location",
          "selection_location_option.slt_location_id",
          "selection_location.slt_location_id"
        )
        .first();
    
    return queryResult;
  } catch (error) {
    throw new InternalServerError('임시 셀렉션을 가져오는데 실패했습니다');
  }
}

export async function checkIfSelectionHasReviews(
  selectionId: number
): Promise<boolean> {
  try {
    const queryResult = await dbConnectionPool("selection_review")
      .select("slt_id")
      .where("slt_id", selectionId)
      .first();

    const queryResult2 = await dbConnectionPool("spot_review")
      .select("spot_id")
      .whereRaw("spot_id IN (SELECT spot_id FROM spot WHERE slt_id = ?)", [selectionId])
      .first();
    
    return !!queryResult || !!queryResult2;
  } catch (error) {
    throw new InternalServerError('셀렉션 리뷰를 확인하는데 실패했습니다');
  }
};

export async function updateSelectionWhereIdEqual(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  selection: IInsertSelection
): Promise<void> {
  const {
    user_id,
    slt_title,
    slt_status,
    slt_category_id,
    slt_location_option_id,
    slt_description,
    slt_img
  } = selection;

  try {
    const updated = await transaction("selection")
      .where("slt_id", '=', selectionId)
      .update({
        user_id,
        slt_title,
        slt_status,
        slt_category_id,
        slt_location_option_id,
        slt_description,
        slt_img
      });

    if (!updated) {
      throw new InternalServerError('셀렉션 수정에 실패했습니다');
    }
  } catch (error) {
    throw new InternalServerError('셀렉션 수정에 실패했습니다');
  }
}

export async function updateTemporarySelectionWhereIdEqual(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  selection: IInsertSelectionTemporary
): Promise<void> {
  const {
    slt_temp_title,
    slt_category_id,
    slt_location_option_id,
    slt_temp_description,
    slt_temp_img
  } = selection;

  try {
    const updated = await transaction("selection_temporary")
      .where("slt_temp_id", '=', selectionId)
      .update({
        slt_temp_title,
        slt_category_id,
        slt_location_option_id,
        slt_temp_description,
        slt_temp_img
      });

    if (!updated) {
      throw new InternalServerError('임시 셀렉션 수정에 실패했습니다');
    }
  } catch (error) {
    throw new InternalServerError('임시 셀렉션 수정에 실패했습니다');
  }
}

export async function deleteTemporarySelectionWhereIdEqual(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number
) {
  try {
    const deleted = await transaction("selection_temporary")
      .where("slt_temp_id", selectionId)
      .delete();

    if (!deleted) {
      throw new InternalServerError('임시 셀렉션 삭제에 실패했습니다');
    }
  } catch (error) {
    throw new InternalServerError('임시 셀렉션 삭제에 실패했습니다');
  }
}