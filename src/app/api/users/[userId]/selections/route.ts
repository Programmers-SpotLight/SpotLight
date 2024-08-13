import { NextRequest, NextResponse } from "next/server";
import {
  ErrorResponse,
  Ipagination,
  IsearchData,
  IsearchResult,
  TsortType
} from "@/models/searchResult.model";
import { Ihashtags } from "@/models/hashtag.model";
import {
  QUERY_STRING_DEFAULT,
  QUERY_STRING_NAME
} from "@/constants/queryString.constants";
import { getUserSelectionQueryCount, getUserSelectionResult } from "@/services/selectionUser.services";
import { TuserSelection } from "@/models/user.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<IsearchResult | ErrorResponse>> {
  const url = req.nextUrl;
  const userId = params.userId;
  const query = url.searchParams;

  const userSelection =
    query.get(QUERY_STRING_NAME.userSelection) ||
    QUERY_STRING_DEFAULT.userSelection;
  const currentPage = parseInt(
    query.get(QUERY_STRING_NAME.page) || QUERY_STRING_DEFAULT.page
  );
  const limit = parseInt(
    query.get(QUERY_STRING_NAME.limit) || QUERY_STRING_DEFAULT.limit
  );
  const sort = query.get(QUERY_STRING_NAME.sort) || QUERY_STRING_DEFAULT.sort;

  try {
    const countResult = await getUserSelectionQueryCount(
      userSelection as TuserSelection,
      userId,
      sort as TsortType
    );
    const totalElements =
      countResult.length > 0 ? parseInt(countResult.length) : 0;
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

    const pageResult: IsearchData[] = await getUserSelectionResult(
      userSelection as TuserSelection,
      userId,
      limit,
      currentPage,
      sort as TsortType
    );

    const finalResults = pageResult.map((item: IsearchData) => ({
      // 해시태그 JSON 파일 타입 변환
      ...item,
      slt_hashtags:
        typeof item.slt_hashtags === "string"
          ? (JSON.parse(item.slt_hashtags) as Ihashtags[])
          : item.slt_hashtags
    }));

    const pagination: Ipagination = {
      currentPage,
      totalPages,
      totalElements,
      limit
    };
    return NextResponse.json({ data: finalResults, pagination });
  } catch (error) {
    return NextResponse.json(
      { error: "데이터 조회 중 오류 발생" },
      { status: 500 }
    ); // Todo : 에러 처리
  }
}
