import { NextRequest, NextResponse } from "next/server";
import {
  ErrorResponse,
  Ipagination,
  IsearchData,
  IsearchResult,
  ItempResult,
  TsortType
} from "@/models/searchResult.model";
import { Ihashtags } from "@/models/hashtag.model";
import {
  QUERY_STRING_DEFAULT,
  QUERY_STRING_NAME
} from "@/constants/queryString.constants";
import {
  getUserSelectionQueryCount,
  getUserSelectionResult,
  getUserTempSelection,
  getUserTempSelectionCount
} from "@/services/selectionUser.services";
import { TuserSelection } from "@/models/user.model";
import { ITempCardProps } from "@/components/common/card/TempCard";
import { IColCardProps } from "@/components/common/card/ColCard";
import { getServerSession } from "next-auth";
import authOptions from "@/libs/authOptions";
import { SELECTION_TAB_TYPE } from "@/constants/myPage.constants";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<IsearchResult | ErrorResponse | ItempResult>> {
  const url = req.nextUrl;
  const userId = params.userId;
  const query = url.searchParams;
  let session_userId;
  const session = await getServerSession(authOptions());
  if (session) session_userId = session.user.id;

  const userSelection =
    query.get(QUERY_STRING_NAME.userSelection) ||
    QUERY_STRING_DEFAULT.userSelection;
  const currentPage = parseInt(
    query.get(QUERY_STRING_NAME.page) || QUERY_STRING_DEFAULT.page
  );
  const limit = parseInt(
    query.get(QUERY_STRING_NAME.limit) ||
      QUERY_STRING_DEFAULT.userSelection_limit
  );
  const sort = query.get(QUERY_STRING_NAME.sort) || QUERY_STRING_DEFAULT.sort;
  const isMyPage =
    query.get(QUERY_STRING_NAME.is_my_page) || QUERY_STRING_DEFAULT.is_my_page;

  try {
    const validation = getUserSelectionValidator(
      currentPage,
      limit,
      userSelection
    );
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (userSelection === SELECTION_TAB_TYPE.temp) {
      const countResult = await getUserTempSelectionCount(userId);
      const totalElements = countResult.length > 0 ? countResult.length : 0;
      const totalPages = Math.ceil(totalElements / limit);

      const pagination: Ipagination = {
        currentPage,
        totalPages,
        totalElements,
        limit
      };

      if (totalElements === 0) {
        return NextResponse.json({ data: [], pagination });
      }

      const tempResult = await getUserTempSelection(userId, currentPage, limit);
      const mappedTempResult = mapTempResult(tempResult);
      return NextResponse.json({ data: mappedTempResult, pagination });
    }

    const countResult = await getUserSelectionQueryCount(
      userSelection as TuserSelection,
      userId,
      sort as TsortType,
      isMyPage === "true"
    );
    const totalElements =
      countResult.length > 0 ? parseInt(countResult.length) : 0;
    const totalPages = Math.ceil(totalElements / limit);

    const pagination: Ipagination = {
      currentPage,
      totalPages,
      totalElements,
      limit
    };

    if (totalElements === 0) {
      return NextResponse.json({ data: [], pagination });
    }

    const pageResult: IsearchData[] = await getUserSelectionResult(
      userSelection as TuserSelection,
      userId,
      limit,
      currentPage,
      sort as TsortType,
      session_userId,
      isMyPage === "true"
    );

    const mappedResults = mapSearchResults(pageResult);
    return NextResponse.json({ data: mappedResults, pagination });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "데이터 조회 중 오류 발생" },
      { status: 500 }
    ); // 에러 처리
  }
}

const mapTempResult = (tempResult: any[]): ITempCardProps[] => {
  return tempResult.map((item) => ({
    title: item.slt_temp_title,
    category: item.slt_category_name,
    region: item.slt_location_option_name,
    description: item.slt_temp_description,
    selectionId: item.slt_temp_id,
    userId: item.user_id,
    created_at: item.slt_temp_created_date.toString(),
    img: item.slt_img
  }));
};

const mapSearchResults = (pageResult: IsearchData[]): IColCardProps[] => {
  return pageResult.map((item) => ({
    thumbnail: item.slt_img,
    category: item.slt_category_name,
    region: item.slt_location_option_name,
    selectionId: item.slt_id,
    hashtags:
      typeof item.slt_hashtags === "string"
        ? (JSON.parse(item.slt_hashtags) as Ihashtags[])
        : item.slt_hashtags,
    description: item.slt_description,
    title: item.slt_title,
    userName: item.user_nickname,
    userImage: item.user_img,
    status: item.slt_status,
    booked: item.is_bookmarked
  }));
};

const getUserSelectionValidator = (
  currentPage: number,
  limit: number,
  userSelection: string
) => {
  if (currentPage < 1) {
    return { error: "현재 페이지는 1 이상이어야 합니다." };
  }
  if (limit < 1 || limit > 12) {
    return { error: "한 페이지당 항목 수는 1 이상 12 이하이어야 합니다." };
  }
  if (
    userSelection !== SELECTION_TAB_TYPE.my &&
    userSelection !== SELECTION_TAB_TYPE.temp &&
    userSelection !== SELECTION_TAB_TYPE.bookmark
  ) {
    return { error: "선택된 탭이 올바르지 않습니다." };
  }
  return { valid: true };
};
