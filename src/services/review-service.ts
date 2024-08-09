import { dbConnectionPool } from "@/libs/db";

interface ISelectionReviews {
  sltOrSpotId: number;
  sort: string;
  page: number;
}

export async function getSelectionReviews({
  sltOrSpotId,
  sort,
  page
}: ISelectionReviews) {
  const userId = 1;
  const maxResults = 5;
  const offset = maxResults * (page - 1);

  const orderByClause = sort === 'like'
    ? [
        { column: 'likeCount', order: 'desc' },
        { column: 'slt_review_updated_date', order: 'desc' }
      ]
    : [
        { column: 'slt_review_updated_date', order: 'desc' }
      ];
      
  const queryResult = await dbConnectionPool
  .select([
    dbConnectionPool.raw('HEX(r.slt_review_id) AS reviewId'),
    'r.slt_id AS sltOrSpotId',
    'r.slt_review_description AS reviewDescription',
    'r.slt_review_score AS reviewScore',
    dbConnectionPool.raw('DATE_FORMAT(r.slt_review_updated_date, "%Y-%m-%d") AS updatedDate'),
    'u.user_id AS userId',
    'u.user_nickname AS userNickname',
    'u.user_img AS userImage',
    dbConnectionPool.raw(`
      GROUP_CONCAT(
        CONCAT(
          '{"reviewImgId":"', HEX(i.slt_review_img_id), 
          '","reviewImgSrc":"', REPLACE(i.slt_review_img_url, '"', '\"'), 
          '","reviewImageOrder":', i.slt_review_img_order, '}'
        ) ORDER BY i.slt_review_img_order SEPARATOR ','
      ) AS reviewImg
    `),
    dbConnectionPool.raw(`
      (SELECT COUNT(*) FROM spotlight.selection_review_like l 
        WHERE HEX(l.slt_review_id) = HEX(r.slt_review_id)) AS likeCount
    `),
    dbConnectionPool.raw(`
      (SELECT COUNT(*) FROM spotlight.selection_review_like l 
        WHERE HEX(l.slt_review_id) = HEX(r.slt_review_id) AND l.user_id = ?) > 0 AS isLiked
    `, [userId])
  ])
  .from('spotlight.selection_review AS r')
  .leftJoin('spotlight.user AS u', 'r.user_id', 'u.user_id')
  .leftJoin('spotlight.selection_review_image AS i', 'r.slt_review_id', 'i.slt_review_id')
  .where('r.slt_id', sltOrSpotId)
  .groupBy('r.slt_review_id', 'r.slt_id', 'r.slt_review_description', 'r.slt_review_score', 'r.slt_review_updated_date', 'u.user_id', 'u.user_nickname', 'u.user_img')
  .orderBy(orderByClause)
  .offset(offset)  
  .limit(maxResults); 

  const reviews = queryResult.map(review => ({
    reviewId: review.reviewId,
    sltOrSpotId: review.sltOrSpotId,
    reviewDescription: review.reviewDescription,
    reviewScore: review.reviewScore,
    updatedDate: review.updatedDate,
    user: {
      userId: review.userId,
      userNickname: review.userNickname,
      userImage: review.userImage,
      isLiked: review.isLiked
    },
    reviewImg: review.reviewImg ? JSON.parse(`[${review.reviewImg}]`) : null,
    likeCount: review.likeCount
  }));

  return reviews;
};

export async function countReviews(
  sltOrSpotId: number, 
  reviewType: "selection" | "spot"
): Promise<number> {
  let result: any;
  if(reviewType === "selection"){
    result = await dbConnectionPool('selection_review')
      .count('* as count')
      .where('slt_id', sltOrSpotId)
      .first();
  } else if(reviewType === "spot") {
    result = await dbConnectionPool('spot_review')
     .count('* as count')
     .where('spot_id', sltOrSpotId)
     .first();
  }
  
  return result ? Number(result.count) : 0;
}

export async function averageReviews(
  sltOrSpotId: number, 
  reviewType: "selection" | "spot"
): Promise<number> {
  let result: any;
  if (reviewType === "selection") {
    result = await dbConnectionPool('selection_review')
      .avg('slt_review_score as average') 
      .where('slt_id', sltOrSpotId)
      .first();
  } else if (reviewType === "spot") {
    result = await dbConnectionPool('spot_review')
      .avg('slt_review_score as average') 
      .where('spot_id', sltOrSpotId)
      .first();
  }
  
  return result && result.average ? parseFloat(result.average) : 0;
}