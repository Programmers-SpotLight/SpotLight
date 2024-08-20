import 'server-only';
import { dbConnectionPool } from "@/libs/db";
import { 
  ISelectionCategory, 
  ISelectionCategoryQueryResultRow, 
  ISelectionLocation, 
  ISelectionLocationQueryResultRow, 
} from "@/models/selection.model";
import {
  InternalServerError,
} from "@/utils/errors";
import { selectAllSelectionCategories, selectAllSelectionLocations } from '@/repositories/selection.repository';


export async function getSelectionCategories(): Promise<ISelectionCategory[]> {
  try {
    const queryResult: ISelectionCategoryQueryResultRow[] = await selectAllSelectionCategories();

    const categories: ISelectionCategory[] = queryResult.map((row) => {
      return {
        id: row.category_id,
        name: row.category_name
      };
    });

    return categories;
  } catch (error) {
    console.error(error);
    throw new InternalServerError("셀렉션 카테고리를 가져오는 데 실패했습니다");
  }
}

export async function getSelectionLocations(): Promise<ISelectionLocation[]> {
  try {
    const queryResult: ISelectionLocationQueryResultRow[] = await selectAllSelectionLocations();

    const locations: Array<ISelectionLocation> = [];
    queryResult.forEach((row: ISelectionLocationQueryResultRow) => {
      const locationId = row.location_id;
      const locationName = row.location_name;
      const locationOptionId = row.location_option_id;
      const locationOptionName = row.location_option_name;

      const location = locations.find((location) => location.id === locationId);
      if (location) {
        location.options.push({
          id: locationOptionId,
          name: locationOptionName
        });
      } else {
        locations.push({
          id: locationId,
          name: locationName,
          options: [
            {
              id: locationOptionId,
              name: locationOptionName
            }
          ]
        });
      }
    });

    return locations;
  } catch (error) {
    console.error(error);
    throw new InternalServerError("셀렉션 위치를 가져오는 데 실패했습니다");
  }
}

export const addBookMarks = async (selectionId: number, userId: number) => {
  try {
    await dbConnectionPool("bookmark").insert({
      user_id: userId,
      slt_id: selectionId
    });
  } catch (error) {
    throw new Error("Failed to add bookmark");
  }
};

export const removeBookMarks = async (selectionId: number, userId: number) => {
  try {
    await dbConnectionPool("bookmark")
      .where({
        user_id: userId,
        slt_id: selectionId
      })
      .del();
  } catch (error) {
    throw new Error("Failed to add bookmark");
  }
};
