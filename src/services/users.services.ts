import { dbConnectionPool } from '@/libs/db';

export const getNicknameFromDatabase = async (userUid: string) => {
  return await dbConnectionPool('user').select('*').where('user_uid', userUid);
}