import "server-only";
import { dbConnectionPool } from "@/libs/db";
import {
  ISelectionCategory,
  ISelectionCategoryQueryResultRow,
  ISelectionLocation,
  ISelectionLocationQueryResultRow
} from "@/models/selection.model";
import { InternalServerError } from "@/utils/errors";
import {
  selectAllSelectionCategories,
  selectAllSelectionLocations
} from "@/repositories/selection.repository";

export async function getSelectionCategories(): Promise<ISelectionCategory[]> {
  try {
    const queryResult: ISelectionCategoryQueryResultRow[] =
      await selectAllSelectionCategories();

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
    const queryResult: ISelectionLocationQueryResultRow[] =
      await selectAllSelectionLocations();

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
    const existingBookmark = await dbConnectionPool("bookmark")
      .select("*")
      .where("slt_id", selectionId)
      .andWhere("user_id", userId);

    if (existingBookmark.length) throw new Error("Failed to add bookmark");

    await dbConnectionPool("bookmark").insert({
      user_id: userId,
      slt_id: selectionId
    });
  } catch (error) {
    throw error;
  }
};

export const removeBookMarks = async (selectionId: number, userId: number) => {
  try {
    const existingBookmark = await dbConnectionPool("bookmark")
      .select("*")
      .where("slt_id", selectionId)
      .andWhere("user_id", userId);

    if (!existingBookmark.length) throw new Error("Failed to remove bookmark");

    await dbConnectionPool("bookmark")
      .where({
        user_id: userId,
        slt_id: selectionId
      })
      .del();
  } catch (error) {
    throw error;
  }
};


export const requestSelectionHashtagComparison = async (
  hashtags: string[]
): Promise<number[]> => {
  try {
    if (hashtags.length < 2) {
      throw new Error('해시태그가 2개 이상 필요합니다');
    }

    if (process.env.AI_SERVER_ADDR === undefined) {
      throw new Error('AI 서버 주소가 설정되지 않았습니다');
    }

    const response = await fetch(`${process.env.AI_SERVER_ADDR}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hashtags),
    });

    if (!response.ok) {
      throw new Error('Failed to request selection hashtag comparison');
    }

    const jsonData = await response.json();
    if (!jsonData.category) {
      throw new Error('AI 서버에서 응답을 받지 못했습니다');
    }

    return jsonData.category[0];
  } catch (error) {
    throw error;
  }
}