import { requestGeocoding } from "@/services/selection.services";
import { NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const googleMapsPlaceId : string | null = searchParams.get("gmap-id");

  if (googleMapsPlaceId === null) {
    return new Response("Please provide a Google Maps Place ID", { status: 400 });
  }

  try {
    const geoData = await requestGeocoding(googleMapsPlaceId);
    return new Response(JSON.stringify(geoData), { status: 200 });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return new Response(error.message, { status }); 
  }
}