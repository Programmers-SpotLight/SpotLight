import { IRowCardProps } from "@/components/common/card/RowCard";
import { getPopularSelection } from "@/services/selectionMain.services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest): Promise<NextResponse<any>> {
    const popularSelections = await getPopularSelection();
    const MappingResults : IRowCardProps[] = popularSelections.map((item)=>({
      thumbnail : item.slt_img,
      title : item.slt_title,
      category : item.slt_category_name,
      region : item.slt_location_option_name,
      description : item.slt_description,
      userName : item.user_nickname,
      userImage : item.user_img,
      booked : false, // 추가 로직 필요,
      selectionId : item.slt_id
    }
    ))
  return NextResponse.json(MappingResults);
}
