import { dbConnectionPool } from "@/libs/db"
import { Ihashtags } from "@/models/hashtag.model";
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
                "hashtag.htag_type"
            )
            .join("hashtag", "user_hashtag.htag_id", "=", "hashtag.htag_id") // hashtag 테이블과 조인
            .where("user_hashtag.user_id", userId); // 특정 user_id로 필터링
        return userHashData;
    } catch (error) {
        console.error("Error fetching user hashtags:", error);
        throw error;
    }
}
