import { requestReverseGeocoding } from "@/services/selectionCreate.services";
import { getTokenForAuthentication } from "@/utils/authUtils";
import { BadRequestError, InternalServerError, UnauthorizedError } from "@/utils/errors";
import { logWithIP } from "@/utils/logUtils";
import { limitAPIUsageWithDuration } from "@/utils/redisUtils";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
  try {
    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }

    await limitAPIUsageWithDuration(
      `selection-creation-reverse-geocoding-${token.userId}`,
      10, 
      '10초에 1번만 위치 정보를 가져올 수 있습니다. 잠시 후 다시 시도해주세요.'
    );

    const { searchParams } = new URL(request.url);
    const latitude : string | null = searchParams.get("latitude");
    const longitude : string | null = searchParams.get("longitude");

    if (latitude === null || longitude === null ) {
      throw new BadRequestError("경도인 longitude와 위도인 latitude를 입력해주세요");
    }

    if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      throw new BadRequestError("latitude와 longitude는 숫자여야 합니다");
    }

    if (Number(latitude) < -90 || Number(latitude) > 90) {
      throw new BadRequestError("latitude는 -90에서 90 사이여야 합니다");
    }

    if (Number(longitude) < -180 || Number(longitude) > 180) {
      throw new BadRequestError("longitude는 -180에서 180 사이여야 합니다");
    }

    const geoData = await requestReverseGeocoding(latitude, longitude);
    return NextResponse.json(geoData, { status: 200 });
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error('GET /api/selections/spots/search - ' + error.response?.data);
      await logWithIP(
        'GET /api/selections/spots/search - ' + error.response?.data,
        request,
        'error'
      );
    }
    const errorMsg = error instanceof InternalServerError ? 
      "서버 내부 오류입니다. 다시 시도해주세요." : (error.message || "알 수 없는 오류입니다.");

    return NextResponse.json(
      { error: errorMsg },
      { status: error.statusCode || 500 }
    );
  }
}