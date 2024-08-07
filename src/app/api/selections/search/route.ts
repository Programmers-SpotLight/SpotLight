import { dbConnectionPool } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse, Ipagination, IsearchData, IsearchResult, TsortType } from "@/models/searchResult.model";
import { Ihashtags } from "@/models/hashtag.model";
import { QUERY_STRING_DEFAULT, QUERY_STRING_NAME } from "@/constants/queryString";
import { searchQueryBuilder } from "./searchQueryBuilder";

export async function GET(req: NextRequest): Promise<NextResponse<IsearchResult | ErrorResponse>> {
  const url = req.nextUrl;
  const query = url.searchParams;

  const category_id = query.get(QUERY_STRING_NAME.category_id) || QUERY_STRING_DEFAULT.category_id;
  const tags = query.getAll(QUERY_STRING_NAME.tags) || QUERY_STRING_DEFAULT.tags;
  const currentPage = parseInt(query.get(QUERY_STRING_NAME.page) || QUERY_STRING_DEFAULT.page);
  const limit = parseInt(query.get(QUERY_STRING_NAME.limit) || QUERY_STRING_DEFAULT.limit);
  const sort = query.get(QUERY_STRING_NAME.sort) || QUERY_STRING_DEFAULT.sort;
  
  try {
    // 전체 결과 수를 계산하는 쿼리
    const countQuery = dbConnectionPool('selection')
    .select(
      'selection.*',
      'user.user_nickname',
      'user.user_img',
      'selection_category.slt_category_name',
      dbConnectionPool.raw('JSON_ARRAYAGG(JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type)) AS slt_hashtags')
    )
    .groupBy('selection.slt_id', 'user.user_id')
    .modify(queryBuilder => searchQueryBuilder(queryBuilder, category_id, tags))

    const countResult = await countQuery;
    const totalElements = countResult.length > 0 ? parseInt(countResult.length) : 0;
    const totalPages = Math.ceil(totalElements / limit);

    if (totalElements === 0) {
      const pagination: Ipagination = {
        currentPage,
        totalPages,
        totalElements,
        limit
      };
      return NextResponse.json({ data: [], pagination });
    }

    // 페이지네이션된 결과를 가져오는 쿼리
    const pageQuery = dbConnectionPool('selection')
      .select(
        'selection.*',
        'user.user_nickname',
        'user.user_img',
        'selection_category.slt_category_name',
        dbConnectionPool.raw('JSON_ARRAYAGG(JSON_OBJECT("htag_id", hashtag.htag_id, "htag_name", hashtag.htag_name, "htag_type", hashtag.htag_type)) AS slt_hashtags')
      )
      .groupBy('selection.slt_id', 'user.user_id')
      .modify(queryBuilder => searchQueryBuilder(queryBuilder, category_id, tags, sort as TsortType))
      .limit(limit)
      .offset((currentPage - 1) * limit);

    const pageResult: IsearchData[] = await pageQuery;

    // 해시태그 JSON 파일 타입 변환
    const finalResults = pageResult.map((item: IsearchData) => ({
      ...item,
      slt_hashtags: typeof item.slt_hashtags === 'string' ? JSON.parse(item.slt_hashtags) as Ihashtags[] : item.slt_hashtags
    }));

    const pagination: Ipagination = {
      currentPage,
      totalPages,
      totalElements,
      limit
    };
    return NextResponse.json({ data: finalResults, pagination });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "데이터 조회 중 오류 발생" }, { status: 500 });
  }
}
