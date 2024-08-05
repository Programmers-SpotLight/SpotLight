import { dbConnectionPool } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const query = url.searchParams;

  const category_id = query.get("category") || "0";
  const region_id = query.get("region") || "0";
  const sort = query.get("sort") || "0";
  const tags = query.getAll("tags") || [];

  console.log(tags);

  try {
    // 기본 쿼리 설정
    const selectionQuery = dbConnectionPool('selection')
      .join('user', 'selection.user_id', '=', 'user.user_id')
      .join('selection_hashtag', 'selection.slt_id', '=', 'selection_hashtag.slt_id')
      .join('selection_category', 'selection.slt_category_id', '=', 'selection_category.slt_category_id')
      .join('hashtag', 'selection_hashtag.htag_id', '=', 'hashtag.htag_id')
      .select(
        'selection.*',
        'user.user_nickname',
        'user.user_img',
        'selection_category.slt_category_name',
        dbConnectionPool.raw('JSON_ARRAYAGG(JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type)) AS slt_hashtags')
      )
      .groupBy('selection.slt_id', 'user.user_id');

    // 카테고리 필터링
    if (category_id !== "0") {
      selectionQuery.where('selection.slt_category_id', category_id);
    }

    // 해시태그 필터링
    if (tags.length > 0) {
      selectionQuery.havingRaw(
        `SUM(CASE WHEN ${tags.map(tag => `hashtag.htag_name LIKE '%${tag}%'`).join(' OR ')} THEN 1 ELSE 0 END) > 0`
      );
    }

    const results = await selectionQuery;

    const formattedResults = results.map(item => ({ // JSON으로 받아온 해시태그 객체로 타입 변환
      ...item,
      slt_hashtags: item.slt_hashtags ? JSON.parse(item.slt_hashtags) : []
    }));

    return NextResponse.json({ data: formattedResults });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "데이터 조회 중 오류 발생" }, { status: 500 });
  }
}
