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
        const existingHashtag = await dbConnectionPool("hashtag")
            .select("htag_id")
            .where({ htag_name: hashtag })
            .first();

        let htagId: number;

        if (!existingHashtag) {
            await dbConnectionPool("hashtag")
                .insert({ htag_name: hashtag, htag_created_date: new Date() });
            
            const [newHashtag] = await dbConnectionPool("hashtag")
                .select("htag_id")
                .where({ htag_name: hashtag })
                .orderBy("htag_id", "desc")
                .limit(1);

            htagId = newHashtag.htag_id;
        } else {
            htagId = existingHashtag.htag_id;
        }

        await dbConnectionPool("user_hashtag")
            .insert({ user_id: userId, htag_id: htagId });

        return { message: "해시태그가 성공적으로 추가되었습니다." };
    } catch (error) {
        console.error("해시태그 추가 중 오류 발생:", error);
        throw new Error("해시태그 추가 중 오류가 발생했습니다.");
    }
};

export const serviceDeleteUserHashtag = async (userId: string, hashtagId: number) => {
    try {
        await dbConnectionPool("user_hashtag")
            .where({ user_id: userId, htag_id: hashtagId })
            .del();

        const count = await dbConnectionPool("user_hashtag")
            .count("* as count")
            .where({ htag_id: hashtagId })
            .first();

        if (count && count.count === 0) {
            await dbConnectionPool("hashtag")
                .where({ htag_id: hashtagId })
                .del();
        }

        return { message: "해시태그가 성공적으로 삭제되었습니다." };
    } catch (error) {
        console.error("해시태그 삭제 중 오류 발생:", error);
        throw new Error("해시태그 삭제 중 오류가 발생했습니다.");
    }
};
