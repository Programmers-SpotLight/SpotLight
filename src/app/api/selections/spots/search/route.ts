import { getTokenForAuthentication } from "@/utils/authUtils";
import { BadRequestError, InternalServerError, UnauthorizedError } from "@/utils/errors";
import { logWithIP } from "@/utils/logUtils";
import { limitAPIUsageWithDuration } from "@/utils/redisUtils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
  try {
    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }

    await limitAPIUsageWithDuration(
      `selection-creation-spot-place-search-${token.userId}`,
      10, 
      '10초에 1번만 위치 정보를 가져올 수 있습니다. 잠시 후 다시 시도해주세요.'
    );

    const { searchParams } = new URL(request.url);
    const query : string | null = searchParams.get("query");

    if (query === null) {
      throw new BadRequestError("쿼리를 입력해주세요.");
    }

    const API_URL = 'https://places.googleapis.com/v1/places:searchText';
    const inputData = {
      textQuery: query,
      languageCode: 'ko',
    };

    const response = await axios.post(
      API_URL, 
      inputData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.attributions,places.id,places.name,nextPageToken',
        }
      }
    );

    return NextResponse.json(response.data.places, { status: 200 });
  } catch (error: any) {
    const errorMsg = error instanceof InternalServerError ? 
      "서버 내부 오류입니다. 다시 시도해주세요." : (error.message || "알 수 없는 오류입니다.");

    await logWithIP(
      'GET /api/selections/spots/search - ' + error.message,
      request,
      'error'
    );

    return NextResponse.json(
      { error: errorMsg },
      { status: error.statusCode || 500 }
    );
  }
};