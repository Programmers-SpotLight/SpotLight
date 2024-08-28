import { ISelectionLocation } from "@/models/selection.model";
import { getSelectionLocations} from "@/services/selection.services";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    const locations : ISelectionLocation[] = await getSelectionLocations();
    return NextResponse.json(locations);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "서버 에러가 발생했습니다" },
      { status: error.statusCode || 500 }
    );
  }
};