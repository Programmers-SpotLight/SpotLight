import { requestReverseGeocoding } from "@/services/selection.services";
import { NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const latitude : string | null = searchParams.get("latitude");
  const longitude : string | null = searchParams.get("longitude");

  if (!latitude || !longitude) {
    return new Response("경도인 longitude와 위도인 latitude를 입력해주세요", { status: 400 });
  }

  if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
    return new Response("latitude와 longitude는 숫자여야 합니다", { status: 400 });
  }


  try {
    const geoData = await requestReverseGeocoding(latitude, longitude);
    return new Response(JSON.stringify(geoData), { status: 200 });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return new Response(error.message, { status }); 
  }
}