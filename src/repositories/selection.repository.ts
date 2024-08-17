import { dbConnectionPool } from "@/libs/db";
import { ISelectionCategoryQueryResultRow, ISelectionLocationQueryResultRow } from "@/models/selection.model";
import { InternalServerError } from "@/utils/errors";
import { Knex } from "knex";

interface ISelection {
  slt_title: string;
  slt_status: string;
  slt_category_id: number;
  slt_location_option_id: number;
  slt_description: string;
  slt_img: string;
}

interface ISelectionTemporary {
  slt_temp_title: string;
  slt_category_id: number | null;
  slt_location_option_id: number | null;
  slt_temp_description: string | null;
  slt_temp_img: string | null;
}

export const insertSelectionGetId = async (
  transaction: Knex.Transaction<any, any[]>,
  selection: ISelection
) : Promise<number[]> => {
  const {
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
        slt_title,
        slt_status,
        slt_category_id,
        slt_location_option_id,
        slt_description,
        slt_img      
      }, ['slt_id']);
  } catch (error : any) {
    console.error(error);
    throw new InternalServerError('셀렉션 생성에 실패했습니다');
  }
}

export const insertSelectionTemporary = async (
  transaction: Knex.Transaction<any, any[]>,
  selection: ISelectionTemporary
) : Promise<number[]> => {
  const {
    slt_temp_title,
    slt_category_id,
    slt_location_option_id,
    slt_temp_description,
    slt_temp_img
  } = selection;

  try {
    return await transaction('selection_temporary')
      .insert({
        slt_temp_title,
        slt_category_id,
        slt_location_option_id,
        slt_temp_description,
        slt_temp_img      
      }, ['slt_temp_id']);
  } catch (error : any) {
    console.error(error);
    throw new InternalServerError('임시 셀렉션 생성에 실패했습니다');
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    throw new InternalServerError('셀렉션 지역을 가져오는데 실패했습니다');
  }
};

export async function selectAllSelectionWhereImageEqual(
  imageURL: string
): Promise<ISelection[]> {
  try {
    const queryResult =
      await dbConnectionPool
        .select()
        .from("selection")
        .where("slt_img", imageURL);

    return queryResult;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('셀렉션을 가져오는데 실패했습니다');
  }
}