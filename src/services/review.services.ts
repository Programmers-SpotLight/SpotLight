import { dbConnectionPool } from "@/libs/db";
import { v4 as uuidv4 } from "uuid";

function generateBinaryUUID(): Buffer {
  const uuid = uuidv4().replace(/-/g, ""); // 하이픈 제거
  return Buffer.from(uuid, "hex"); // 16바이트의 Buffer로 변환
}

const buildQuery = (
  reviewType: "selection" | "spot",
  userId: number
) => {
  let query = dbConnectionPool.queryBuilder();

  if (reviewType === "selection") {
    query = query
      .select(
        dbConnectionPool.raw('HEX(r.slt_review_id) AS reviewId'),
        'r.slt_id AS sltOrSpotId',
        's.slt_title AS sltName',
        dbConnectionPool.raw('NULL AS spotName'),
        'r.slt_review_description AS reviewDescription',
        'r.slt_review_score AS reviewScore',
        'r.slt_review_created_date AS createdDate',
        'r.slt_review_updated_date AS updatedDate',
        dbConnectionPool.raw('COUNT(l.slt_review_id) AS likeCount'),
        dbConnectionPool.raw(`
          GROUP_CONCAT(
            CONCAT(
              '{"reviewImgId":"', HEX(i.slt_review_img_id), 
              '","reviewImgSrc":"', REPLACE(i.slt_review_img_url, '"', '\"'), 
              '","reviewImageOrder":', i.slt_review_img_order, '}'
            ) ORDER BY i.slt_review_img_order SEPARATOR ','
          ) AS reviewImg
        `)
      )
      .from('selection_review AS r')
      .leftJoin('selection_review_like AS l', 'r.slt_review_id', 'l.slt_review_id')
      .leftJoin('selection AS s', 's.slt_id', 'r.slt_id')
      .leftJoin('selection_review_image AS i', 'r.slt_review_id', 'i.slt_review_id')
      .where('r.user_id', userId)
      .groupBy('r.slt_review_id', 'r.slt_id', 's.slt_title', 'r.slt_review_description', 'r.slt_review_score', 'r.slt_review_updated_date')
      .orderBy('r.slt_review_created_date', 'desc'); // 최신순으로 정렬

  } else if (reviewType === "spot") {
    query = query
      .select(
        dbConnectionPool.raw('HEX(r.spot_review_id) AS reviewId'),
        dbConnectionPool.raw('HEX(r.spot_id) AS sltOrSpotId'),
        's.spot_title AS spotName',
        'slt.slt_title AS sltName',
        'r.spot_review_description AS reviewDescription',
        'r.spot_review_score AS reviewScore',
        'r.spot_review_created_date AS createdDate',
        'r.spot_review_updated_date AS updatedDate',
        dbConnectionPool.raw('COUNT(l.spot_review_id) AS likeCount'),
        dbConnectionPool.raw(`
          GROUP_CONCAT(
            CONCAT(
              '{"reviewImgId":"', HEX(i.spot_review_img_id), 
              '","reviewImgSrc":"', REPLACE(i.spot_review_img_url, '"', '\"'), 
              '","reviewImageOrder":', i.spot_review_img_order, '}'
            ) ORDER BY i.spot_review_img_order SEPARATOR ','
          ) AS reviewImg
        `)
      )
      .from('spot_review AS r')
      .leftJoin('spot_review_like AS l', 'r.spot_review_id', 'l.spot_review_id')
      .leftJoin('spot AS s', 's.spot_id', 'r.spot_id')
      .leftJoin('selection AS slt', 's.slt_id', 'slt.slt_id')
      .leftJoin('spot_review_image AS i', 'r.spot_review_id', 'i.spot_review_id')
      .where('r.user_id', userId)
      .groupBy('r.spot_review_id', 'r.spot_id', 's.spot_title', 'slt.slt_title', 'r.spot_review_description', 'r.spot_review_score', 'r.spot_review_updated_date')
      .orderBy('r.spot_review_created_date', 'desc'); // 최신순으로 정렬
  } else {
    throw new Error("Invalid reviewType");
  }

  return query;
};

export const getMyReviews = async (
  reviewType: ReviewType,
  userId: number,
  page : number
) => {
  try {
    const limit = 5; 
    const offset = (page - 1) * limit; 

    // 쿼리 빌더 함수를 호출
    const query = buildQuery(reviewType, userId)
      .limit(limit)
      .offset(offset);

    const reviews = await query;

    return reviews.map(review => ({
      reviewId: review.reviewId,
      sltOrSpotId: review.sltOrSpotId,
      sltName: review.sltName,
      spotName: review.spotName,
      reviewDescription: review.reviewDescription,
      reviewScore: review.reviewScore,
      createdDate: review.createdDate,
      updatedDate: review.updatedDate,
      likeCount: review.likeCount,
      reviewImg: review.reviewImg ? JSON.parse(`[${review.reviewImg}]`) : null
    }));
  } catch (error) {
    console.error("Error details:", error);
    throw new Error("Failed to add review like");
  }
}

export const countMyReviews = async (
  reviewType: ReviewType,
  userId: number
): Promise<number> => {
  try {
    let countResult;
    if (reviewType === "selection") {
      // selection 리뷰 개수 계산
      countResult = await dbConnectionPool("selection_review")
        .where("user_id", userId)
        .count({ count: "*" });
    } else {
      // spot 리뷰 개수 계산
      countResult = await dbConnectionPool("spot_review")
        .where("user_id", userId)
        .count({ count: "*" });
    }

    // 결과 확인 및 기본값 처리
    const count = countResult[0]?.count || 0;

    // 숫자 형식으로 반환
    return typeof count === "number" ? count : parseInt(count, 10);
  } catch (error) {
    console.error("Error counting reviews:", error);
    throw new Error("Failed to count reviews");
  }
};

export const addLike = async (
  reviewId: string,
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
        slt_review_id: dbConnectionPool.raw('UNHEX(?)', [reviewId])
      });
    } else {
      //spot add like
      await dbConnectionPool("spot_review_like").insert({
        spot_review_like_id: reviewLikeId,
        user_id: userId,
        spot_review_id: dbConnectionPool.raw('UNHEX(?)', [reviewId])
      });
    }
  } catch (error) {

    console.error("Error details:", error);
    throw new Error("Failed to add review like");
  }
};

export const removeLike = async (
  reviewId: string,
  reviewType: ReviewType,
  userId: number
) => {
  try {
    if (reviewType === "selection") {
      //selection remove like
      await dbConnectionPool("selection_review_like")
        .where({
          user_id: userId,
          slt_review_id: dbConnectionPool.raw('UNHEX(?)', [reviewId])
        })
        .del();
    } else {
      //spot remove like
      await dbConnectionPool("spot_review_like")
        .where({
          user_id: userId,
          spot_review_id: dbConnectionPool.raw('UNHEX(?)', [reviewId])
        })
        .del();
    }
  } catch (error) {
    throw new Error("Failed to remove review like");
  }
};
