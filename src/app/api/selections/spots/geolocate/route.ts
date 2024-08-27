import { requestGeocoding } from "@/services/selectionCreate.services";
import { getTokenForAuthentication } from "@/utils/authUtils";
import { BadRequestError, InternalServerError, UnauthorizedError } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
  try {
    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }

    const { searchParams } = new URL(request.url);
    const googleMapsPlaceId : string | null = searchParams.get("gmap-id");
    if (googleMapsPlaceId === null) {
      throw new BadRequestError("구글 맵 ID를 제공해주세요.");
    }

    const geoData = await requestGeocoding(googleMapsPlaceId);

    return NextResponse.json(geoData, { status: 200 });
  } catch (error: any) {
    const errorMsg = error instanceof InternalServerError ? 
      "서버 내부 오류입니다. 다시 시도해주세요." : (error.message || "알 수 없는 오류입니다.");

    return NextResponse.json(
      { error: errorMsg },
      { status: error.statusCode || 500 }
    );
  }
}