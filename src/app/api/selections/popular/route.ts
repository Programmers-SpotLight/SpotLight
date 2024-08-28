import { IRowCardProps } from "@/components/common/card/RowCard";
import { ErrorResponse } from "@/models/user.model";
import { getPopularSelection } from "@/services/selectionMain.services";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IRowCardProps[] | ErrorResponse>> {
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
      booked: false,
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
