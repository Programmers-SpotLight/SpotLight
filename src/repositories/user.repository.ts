import { dbConnectionPool } from "@/libs/db"


export const selectUserIDByTypeAndUid = async (type: string, uid: string) => {
  try {
    const user = await dbConnectionPool("user")
      .select("user_id")
      .where("user_type", type)
      .andWhere("user_uid", uid)
      .first();
    
    return user?.user_id;
  } catch (error) {}
};