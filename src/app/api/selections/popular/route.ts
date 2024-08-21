import { IRowCardProps } from "@/components/common/card/RowCard";
import { ErrorResponse, SuccessResponse } from "@/models/user.model";
import { getPopularSelection } from "@/services/selectionMain.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IRowCardProps[] | ErrorResponse>> {
  // Todo : 쿠키로 userId를 받고, 로그인 되면 booked 값 설정
  try {
    const popularSelections = await getPopularSelection();
    const MappingResults: IRowCardProps[] = popularSelections.map((item) => ({
      thumbnail: item.slt_img,
      title: item.slt_title,
      category: item.slt_category_name,
      region: item.slt_location_option_name,
      description: item.slt_description,
      userName: item.user_nickname,
      userImage: item.user_img,
      // booked: false, // 추가 로직 필요,
      selectionId: item.slt_id
    }));
    return NextResponse.json(MappingResults);
  } catch (error) {
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다" },
      { status: 500 }
    );
  }
}
