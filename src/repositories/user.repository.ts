import { dbConnectionPool } from "@/libs/db"
import { InternalServerError } from "@/utils/errors";
import { Knex } from "knex";


export const selectUserIDByTypeAndUid = async (type: string, uid: string) => {
  try {
    const user = await dbConnectionPool("user")
      .select("user_id")
      .where("user_type", type)
      .andWhere("user_uid", uid)
      .first();
    
    return user?.user_id;
  } catch (error) {
    console.error(error);
    throw new InternalServerError("유저 아이디를 조회하는데 실패했습니다");
  }
};

export const selectAllUserId : () => Promise<number[]> = async () => {
  try {
    const users = await dbConnectionPool("user")
      .select("user_id");
    
    return users.map((user) => user.user_id);
  } catch (error) {
    throw new InternalServerError("유저 아이디를 조회하는데 실패했습니다");
  }
};

export const insertUserSelectionRecommendation = async (
  transaction: Knex.Transaction<any, any[]>,
  userId: number, 
  selectionIds: number[]
) => {
  try {
    await transaction("user_selection_recommendation")
      .insert(
        selectionIds.map((selectionId) => ({
          id: transaction.raw('UUID_TO_BIN(UUID())'),
          user_id: userId,
          slt_id: selectionId
        })),
        ['id']
      );
  } catch (error) {
    throw new InternalServerError("유저 추천 셀렉션을 추가하는데 실패했습니다");
  }
};

export const deleteAllUserSelectionRecommendation = async (
  transaction: Knex.Transaction<any, any[]>,
  userId: number,
) => {
  try {
    await transaction("user_selection_recommendation")
      .where("user_id", userId)
      .delete();
  } catch (error) {
    throw new InternalServerError("유저 추천 셀렉션을 삭제하는데 실패했습니다");
  }
};