import { dbConnectionPool } from "@/libs/db";


interface ISelectionReviews {
  sltOrSpotId: number;
  sort: string;
  page: number;
  userId: number;
}

export const extractFilePathFromUrl = (url: string): string => {
  const urlObject = new URL(url);
  return decodeURIComponent(urlObject.pathname.slice(1)); // Remove the leading '/'
};

export async function getSelectionReviews({
  sltOrSpotId,
  sort,
  page,
  userId
}: ISelectionReviews) {
  const maxResults = 5;
  const offset = maxResults * (page - 1);

  const orderByClause = sort === 'like'
    ? [{ column: 'likeCount', order: 'desc' }]
    : [{ column: 'slt_review_created_date', order: 'desc' }];

  const selectColumns = [
    dbConnectionPool.raw('HEX(r.slt_review_id) AS reviewId'),
    'r.slt_id AS sltOrSpotId',
    'r.slt_review_description AS reviewDescription',
    'r.slt_review_score AS reviewScore',
    dbConnectionPool.raw('DATE_FORMAT(r.slt_review_created_date, "%Y-%m-%d") AS createdDate'),
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
    `)
  ];

  if (userId) {
    selectColumns.push(
      dbConnectionPool.raw(`
        (SELECT COUNT(*) FROM spotlight.selection_review_like l 
          WHERE HEX(l.slt_review_id) = HEX(r.slt_review_id) AND l.user_id = ?) > 0 AS isLiked
      `, [userId])
    );
  }

  const queryResult = await dbConnectionPool
    .select(selectColumns)
    .from('spotlight.selection_review AS r')
    .leftJoin('spotlight.user AS u', 'r.user_id', 'u.user_id')
    .leftJoin('spotlight.selection_review_image AS i', 'r.slt_review_id', 'i.slt_review_id')
    .where('r.slt_id', sltOrSpotId)
    .groupBy('r.slt_review_id', 'r.slt_id', 'r.slt_review_description', 'r.slt_review_score', 'r.slt_review_created_date', 'u.user_id', 'u.user_nickname', 'u.user_img')
    .orderBy(orderByClause)
    .offset(offset)  
    .limit(maxResults);

  const reviews = queryResult.map(review => ({
    reviewId: review.reviewId,
    sltOrSpotId: review.sltOrSpotId,
    reviewDescription: review.reviewDescription,
    reviewScore: review.reviewScore,
    createdDate: review.createdDate,
    updatedDate: review.updatedDate,
    user: {
      userId: review.userId,
      userNickname: review.userNickname,
      userImage: review.userImage,
      isLiked: userId ? review.isLiked : null
    },
    reviewImg: review.reviewImg ? JSON.parse(`[${review.reviewImg}]`) : null,
    likeCount: review.likeCount
  }));

  return reviews;
}

export async function countReviews(
  sltOrSpotId: number | string, 
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
     .whereRaw('spot_id = UNHEX(?)', [sltOrSpotId])
     .first();
  }
  
  return result ? Number(result.count) : 0;
}

export async function averageReviews(
  sltOrSpotId: number | string, 
  reviewType: "selection" | "spot"
): Promise<number> {
  let result: any;
  if (reviewType === "selection") {
    result = await dbConnectionPool('selection_review')
      .select(dbConnectionPool.raw('ROUND(AVG(slt_review_score), 1) as average'))
      .where('slt_id', sltOrSpotId)
      .first();
  } else if (reviewType === "spot") {
    result = await dbConnectionPool('spot_review')
      .select(dbConnectionPool.raw('ROUND(AVG(spot_review_score), 1) as average'))
      .whereRaw('spot_id = UNHEX(?)', [sltOrSpotId])
      .first();
  }
  
  return result && result.average ? parseFloat(result.average) : 0;
}

export async function postSelectionReviews(review: IReviewInsertData) {
  try {
    await dbConnectionPool.transaction(async (trx) => {
      await trx('selection_review').insert({
        slt_review_id: review.reviewId,
        user_id: review.userId,
        slt_id: review.sltOrSpotId,
        slt_review_description: review.reviewDescription,
        slt_review_score: review.reviewScore,
      });

      if (review.reviewImg && review.reviewImg.length > 0) {
        const reviewImage = review.reviewImg.map((img) => ({
          slt_review_img_id: img.reviewImgId,
          slt_review_id: review.reviewId,
          slt_review_img_url: img.reviewImgSrc,
          slt_review_img_order: img.reviewImageOrder,
        }));

        await trx('selection_review_image').insert(reviewImage);
      }
    });
  } catch (error) {
    console.error("Error inserting review:", error);
    throw new Error('Failed to post selection review');
  }
}

export async function putSelectionReviews(review: IReviewInsertData) {
  try {
    await dbConnectionPool.transaction(async (trx) => {
      await trx('selection_review')
        .whereRaw('slt_review_id = UNHEX(?)', [review.reviewId])
        .update({
          slt_review_description: review.reviewDescription,
          slt_review_score: review.reviewScore,
        });

        await trx('selection_review_image')
          .whereRaw('slt_review_id = UNHEX(?)', [review.reviewId])
          .del();
        
      if (review.reviewImg && review.reviewImg.length > 0) {
        const reviewImage = review.reviewImg.map((img) => ({
          slt_review_img_id: img.reviewImgId,
          slt_review_id: trx.raw('UNHEX(?)', [review.reviewId]), 
          slt_review_img_url: img.reviewImgSrc,
          slt_review_img_order: img.reviewImageOrder,
        }));

        await trx('selection_review_image').insert(reviewImage);
      }
    });
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error('Failed to update selection review');
  }
}

export async function getSelectionReviewImages(reviewId: string) {
  try {    
    const images = await dbConnectionPool('selection_review_image')
      .select('slt_review_img_id as reviewImgId', 'slt_review_img_url as reviewImgSrc', 'slt_review_img_order as reviewImageOrder')
      .whereRaw('slt_review_id = UNHEX(?)', [reviewId]);
    
    return images.map(img => ({
      reviewImgId: img.reviewImgId,
      reviewImgSrc: img.reviewImgSrc,
      reviewImageOrder: img.reviewImageOrder,
    }));
  } catch (error) {
    console.error("Error fetching review images:", error);
    throw new Error('Failed to fetch selection review images');
  }
}



export async function deleteSelectionReviews(reviewId: string) {
  try {
    await dbConnectionPool.transaction(async (trx) => {
      await trx('selection_review_image')
        .whereRaw('slt_review_id = UNHEX(?)', [reviewId])
        .del();

      await trx('selection_review')
        .whereRaw('slt_review_id = UNHEX(?)', [reviewId])
        .del();
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error('Failed to delete selection review');
  }
}

