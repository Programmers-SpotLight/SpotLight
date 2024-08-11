import { dbConnectionPool } from "@/libs/db";
import { v4 as uuidv4 } from "uuid";

function generateBinaryUUID(): Buffer {
  const uuid = uuidv4().replace(/-/g, ""); // 하이픈 제거
  return Buffer.from(uuid, "hex"); // 16바이트의 Buffer로 변환
}

export const addLike = async (
  reviewId: number,
  reviewType: ReviewType,
  userId: number
) => {
  try {
    const reviewLikeId = generateBinaryUUID();
    if (reviewType === "selection") {
      //selection add like
      await dbConnectionPool("selection_review_like").insert({
        slt_review_like_id: reviewLikeId,
        user_id: userId,
        slt_review_id: reviewId
      });
    } else {
      //spot add like
      await dbConnectionPool("spot_review_like").insert({
        spot_review_like_id: reviewLikeId,
        user_id: userId,
        spot_review_id: reviewId
      });
    }
  } catch (error) {
    throw new Error("Failed to add review like");
  }
};

export const removeLike = async (
  reviewId: number,
  reviewType: ReviewType,
  userId: number
) => {
  try {
    if (reviewType === "selection") {
      //selection remove like
      await dbConnectionPool("selection_review_like")
        .where({
          user_id: userId,
          slt_review_id: reviewId
        })
        .del();
    } else {
      //spot remove like
      await dbConnectionPool("spot_review_like")
        .where({
          user_id: userId,
          spot_review_id: reviewId
        })
        .del();
    }
  } catch (error) {
    throw new Error("Failed to remove review like");
  }
};
