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
import { getUserSelectionQueryCount, getUserSelectionResult, getUserTempSelection, getUserTempSelectionCount } from "@/services/selectionUser.services";
import { TuserSelection } from "@/models/user.model";
import { ITempCardProps } from "@/components/common/card/TempCard";
import { IColCardProps } from "@/components/common/card/ColCard";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<IsearchResult | ErrorResponse | ItempResult>> {
  const url = req.nextUrl;
  const userId = params.userId;
  const query = url.searchParams;

  const userSelection =query.get(QUERY_STRING_NAME.userSelection) ||QUERY_STRING_DEFAULT.userSelection;
  const currentPage = parseInt(query.get(QUERY_STRING_NAME.page) || QUERY_STRING_DEFAULT.page);
  const limit = parseInt(query.get(QUERY_STRING_NAME.limit) || QUERY_STRING_DEFAULT.userSelection_limit);
  const sort = query.get(QUERY_STRING_NAME.sort) || QUERY_STRING_DEFAULT.sort;

  if (userSelection === "temp") {
    try {
      const countResult = await getUserTempSelectionCount(userId)
      const totalElements = countResult.length > 0 ? countResult.length : 0;
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

      const pagination: Ipagination = {
        currentPage,
        totalPages,
        totalElements,
        limit
      };
      const tempResult = await getUserTempSelection(userId, currentPage, limit)
      const mappingTempResult : ITempCardProps[] = tempResult.map((item)=>(
        {              
        title : item.slt_temp_title,
        category : item.slt_category_name,
        region : item.slt_location_option_name,
        description : item.slt_temp_description,
        selectionId : item.slt_temp_id,
        userId : item.user_id,
        created_at : item.slt_temp_created_date.toString(),
        img : item.slt_img,
        }
      ))
    return NextResponse.json({ data : mappingTempResult, pagination})
    } catch {
      return NextResponse.json(
        { error: "데이터 조회 중 오류 발생" },{ status: 500 }
      ); // Todo : 에러 처리
    }
  }

  try {
    const countResult = await getUserSelectionQueryCount(
      userSelection as TuserSelection,
      userId,
      sort as TsortType
    );
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

    const pageResult: IsearchData[] = await getUserSelectionResult(
      userSelection as TuserSelection,
      userId,
      limit,
      currentPage,
      sort as TsortType
    );

    const hashConvert = pageResult.map((item: IsearchData) => ({
      ...item,
      slt_hashtags:
        typeof item.slt_hashtags === "string"
          ? (JSON.parse(item.slt_hashtags) as Ihashtags[])
          : item.slt_hashtags
    }));

    const MappingResults : IColCardProps[] = hashConvert.map((item) => ({
      thumbnail: item.slt_img,
      category: item.slt_category_name,
      region: item.slt_location_option_name,
      selectionId: item.slt_id,
      hashtags: item.slt_hashtags,
      description: item.slt_description,
      title: item.slt_title,
      userName: item.user_nickname,
      userImage: item.user_img,
      status: item.slt_status,
  }));

    const pagination: Ipagination = {
      currentPage,
      totalPages,
      totalElements,
      limit
    };
    return NextResponse.json({ data: MappingResults, pagination });
  } catch (error) {
    return NextResponse.json(
      { error: "데이터 조회 중 오류 발생" },{ status: 500 }
    ); // Todo : 에러 처리
  }
}
