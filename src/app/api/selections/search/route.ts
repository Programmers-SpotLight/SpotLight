import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse, Ipagination, IsearchData, IsearchResult, TsortType } from "@/models/searchResult.model";
import { Ihashtags } from "@/models/hashtag.model";
import { getSearchResult, getSearchResultCount } from "@/services/selectionSearch.services";
import { QUERY_STRING_DEFAULT, QUERY_STRING_NAME } from "@/constants/queryString.constants";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest): Promise<NextResponse<IsearchResult | ErrorResponse>> {
  const url = req.nextUrl;
  const query = url.searchParams;
  let userId;
  const session = await getServerSession(authOptions);
  if(session) userId = session.user.id

  const category_id = query.get(QUERY_STRING_NAME.category_id) || QUERY_STRING_DEFAULT.category_id;
  const region_id = query.get(QUERY_STRING_NAME.region_id) || QUERY_STRING_DEFAULT.region_id;
  const tags = query.getAll(QUERY_STRING_NAME.tags) || QUERY_STRING_DEFAULT.tags;
  const currentPage = parseInt(query.get(QUERY_STRING_NAME.page) || QUERY_STRING_DEFAULT.page);
  const limit = parseInt(query.get(QUERY_STRING_NAME.limit) || QUERY_STRING_DEFAULT.limit);
  const sort = query.get(QUERY_STRING_NAME.sort) || QUERY_STRING_DEFAULT.sort;

  const validation = getSearchResultValidator(tags, currentPage, limit);
  if (validation.error) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const countResult = await getSearchResultCount(category_id, region_id, tags, sort as TsortType);
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

    const pageResult: IsearchData[] = await getSearchResult(category_id, region_id, tags, sort as TsortType, limit, currentPage, userId);
    const mappingResults = mapSearchResults(pageResult);

    const pagination: Ipagination = {
      currentPage,
      totalPages,
      totalElements,
      limit
    };
    return NextResponse.json({ data: mappingResults, pagination });
  } catch (error) {
    return NextResponse.json({ error: "데이터 조회 중 오류 발생" }, { status: 500 });
  }
}

const getSearchResultValidator = (tags: string[], currentPage: number, limit: number) => {
  if (tags.length > 8) {
    return { error: "해시태그는 최대 8개까지 등록할 수 있습니다." };
  }

  for (const tag of tags) {
    if (tag.length > 10) {
      return { error: "해시태그는 10글자 이내여야 합니다." };
    }
  }

  if (currentPage < 1) {
    return { error: "현재 페이지는 1 이상이어야 합니다." };
  }

  if (limit < 1 || limit > 12) {
    return { error: "한 페이지당 항목 수는 1 이상 12 이하이어야 합니다." };
  }

  return { valid: true };
};

const mapSearchResults = (results: IsearchData[]): any[] => {
  return results.map((item: IsearchData) => ({
    thumbnail: item.slt_img,
    category: item.slt_category_name,
    region: item.slt_location_option_name,
    selectionId: item.slt_id,
    hashtags: typeof item.slt_hashtags === 'string' ? JSON.parse(item.slt_hashtags) as Ihashtags[] : item.slt_hashtags,
    description: item.slt_description,
    title: item.slt_title,
    userName: item.user_nickname,
    userImage: item.user_img,
    status: item.slt_status,
    booked : item.is_bookmarked
  }));
};
