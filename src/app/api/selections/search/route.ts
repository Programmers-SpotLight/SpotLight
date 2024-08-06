import { dbConnectionPool } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { searchQueryBuilder } from "./searchQueryBuilder";


interface Selection { // 병합 시 작성 모델 적용
  slt_id: number;
  user_id: number;
  user_nickname: string;
  user_img: string;
  slt_category_name: string;
  slt_hashtags: string;
}

interface Pagination { // 병합 시 작성 모델 적용
  currentPage: number;
  totalPages: number;
  totalElements: number;
  limit: number;
}

interface ResponseData { // 병합 시 작성 모델 적용
  data: Selection[];
  pagination: Pagination;
}

interface ErrorResponse { // 병합 시 작성 모델 적용
  error: string;
}

export async function GET(req: NextRequest): Promise<NextResponse<ResponseData | ErrorResponse>> {
  const url = req.nextUrl;
  const query = url.searchParams;

  const category_id = query.get("category") || "0";
  const tags = query.getAll("tags") || [];
  const currentPage = parseInt(query.get("page") || "1", 10);
  const limit = parseInt(query.get("limit") || "8", 10);

  try {
    // 전체 결과 수를 계산하는 쿼리
    const countQuery = dbConnectionPool('selection')
      .countDistinct('selection.slt_id as total_count')
      .modify(queryBuilder => searchQueryBuilder(queryBuilder, category_id, tags));

    const countResult = await countQuery;
    const totalElements = countResult[0].total_count;
    const totalPages = Math.ceil(totalElements / limit);

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
      .modify(queryBuilder => searchQueryBuilder(queryBuilder, category_id, tags))
      .limit(limit)
      .offset((currentPage - 1) * limit);

    const pageResult: Selection[] = await pageQuery;

    // 해시태그 JSON 파일 타입 변환
    const finalResults = pageResult.map((item: Selection) => ({
      ...item,
      slt_hashtags: item.slt_hashtags ? JSON.parse(item.slt_hashtags) : []
    }));

    const pagination: Pagination = {
      currentPage,
      totalPages,
      totalElements,
      limit
    };
    
    console.log(pagination);
    return NextResponse.json({ data: finalResults, pagination });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "데이터 조회 중 오류 발생" }, { status: 500 });
  }
}
