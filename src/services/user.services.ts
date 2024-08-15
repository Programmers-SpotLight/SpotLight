import { dbConnectionPool } from "@/libs/db"
import { Ihashtags, ThtagType } from "@/models/hashtag.model";
import { IUserInfoData } from "@/models/user.model";

export const getUserInfo = async (userId: string) => {
    try {
        const userInfoData : IUserInfoData = await dbConnectionPool("user")
            .select(
                "user.user_nickname",
                "user.user_email",
                "user.user_img",
                "user.user_description",
                "user.user_role",
                "user.user_is_private",
                "user.user_type",
                dbConnectionPool.raw("(SELECT COUNT(*) FROM selection WHERE selection.user_id = user.user_id) as selection_count"),
                dbConnectionPool.raw("(SELECT COUNT(*) FROM bookmark WHERE bookmark.user_id = user.user_id) as bookmark_count"),
                dbConnectionPool.raw("(SELECT COUNT(*) FROM spot_review WHERE spot_review.user_id = user.user_id) as spot_review_count"),
                dbConnectionPool.raw("(SELECT COUNT(*) FROM selection_review WHERE selection_review.user_id = user.user_id) as selection_review_count"),
            )
            .where("user.user_id", userId)
            .first();
    
        return userInfoData;
    } catch (error) {
        console.error("Error fetching user and selection count:", error);
        throw error; 
}    
}

export const getUserHashTags = async (userId: string) => {
    try {
        const userHashData: Ihashtags[] = await dbConnectionPool("user_hashtag")
            .select(
                "user_hashtag.user_htag_id",
                "hashtag.htag_name",
                "hashtag.htag_type",
            )
            .join("hashtag", "user_hashtag.htag_id", "=", "hashtag.htag_id") 
            .where("user_hashtag.user_id", userId)
            .orderBy("hashtag.htag_created_date", "asc");
        return userHashData;
    } catch (error) {
        console.error("Error fetching user hashtags:", error);
        throw error;
    }
}
export const serviceUserDescription = async (userId: string, description: string) => {
    try {
        const queryData = await dbConnectionPool("user")
            .where({ user_id: userId })
            .update({ user_description: description });

        return queryData;
    } catch (error) {
        console.error("Error updating user description:", error);
        throw error;
    }
};

export const servicePostUserHashtag = async (userId: string, hashtag: string) => {
    try {
        const userHashtagCount = await dbConnectionPool("user_hashtag")
            .where({ user_id: userId })
            .count("user_htag_id as count")
            .first();

        if (userHashtagCount && userHashtagCount.count as number >= 8) {
            return new Error("해시태그는 최대 8개까지 등록이 가능합니다.");
        }

        let htag = await dbConnectionPool("hashtag")
            .select("htag_id", "htag_type", "htag_name")
            .where({ htag_name: hashtag })
            .first();

        if (!htag) {
            await dbConnectionPool("hashtag")
                .insert({ htag_name: hashtag });

            htag = await dbConnectionPool("hashtag")
                .select("htag_id", "htag_type", "htag_name")
                .where({ htag_name: hashtag })
                .first();
        }

        const existingUserHashtag = await dbConnectionPool("user_hashtag")
            .where({ user_id: userId, htag_id: htag.htag_id })
            .first();

        if (!existingUserHashtag) {
            await dbConnectionPool("user_hashtag")
                .insert({ user_id: userId, htag_id: htag.htag_id });
        }

        return htag;
    } catch (error) {
        console.error("해시태그 추가 중 오류 발생:", error);
        throw new Error("해시태그 추가 중 오류가 발생했습니다.");
    }
};


export const serviceDeleteUserHashtagById = async (userId: string, userHashtagId: number) => {
    try {
        const existingRecord = await dbConnectionPool('user_hashtag')
            .where({ user_id: userId, user_htag_id: userHashtagId })
            .first();

        if (!existingRecord) {
            throw new Error('해당 레코드가 존재하지 않습니다.');
        }

        await dbConnectionPool('user_hashtag')
            .where({ user_htag_id: userHashtagId })
            .del();

        return { message: '레코드가 성공적으로 삭제되었습니다.' };
    } catch (error) {
        console.error('레코드 삭제 중 오류 발생:', error);
        throw new Error('레코드 삭제 중 오류가 발생했습니다.');
    }
};