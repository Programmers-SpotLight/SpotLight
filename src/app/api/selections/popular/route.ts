import { getPopularSelection } from "@/services/selectionMain.services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest): Promise<NextResponse<any>> {
    const popularSelections = await getPopularSelection();
  return NextResponse.json(popularSelections);
}
