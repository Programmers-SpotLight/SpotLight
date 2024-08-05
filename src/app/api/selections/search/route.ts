import { dbConnectionPool } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const query = url.searchParams;

  const category = query.get("category") || "0";
  const location = query.get("region") || "0";
  const sort = query.get("sort") || "0";
  const tags = query.getAll("tags") || [];

  console.log(category, location, sort, tags);

  try {
    const results = await dbConnectionPool('selection')
      .join('user', 'selection.user_id', '=', 'user.user_id')
      .join('selection_hashtag', 'selection.slt_id', '=', 'selection_hashtag.slt_id')
      .join('hashtag', 'selection_hashtag.htag_id', '=', 'hashtag.htag_id')
      .select(
        'selection.*',
        'user.user_nickname',
        'user.user_img',
        dbConnectionPool.raw('JSON_ARRAYAGG(JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type)) AS slt_hashtags')
      )
      .groupBy('selection.slt_id', 'user.user_id');

    const formattedResults = results.map(item => ({
      ...item,
      slt_hashtags: item.slt_hashtags ? JSON.parse(item.slt_hashtags) : []
    }));
    return NextResponse.json({ data: formattedResults });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "데이터 조회 중 오류 발생" }, { status: 500 });
  }
}
