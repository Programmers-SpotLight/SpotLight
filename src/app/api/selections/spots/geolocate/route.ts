import axios from "axios";
import { NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const googleMapsPlaceId : string | null = searchParams.get("gmap-id");

  if (!googleMapsPlaceId) {
    return new Response("Please provide a Google Maps Place ID", { status: 400 });
  }

  const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&place_id=${googleMapsPlaceId}&language=ko`;

  const response = await axios.get(API_URL);
  if (response.data.status === 'ZERO_RESULTS') {
    return new Response("No results found", { status: 404 });
  }

  const responseData = {
    formatted_address: response.data.results[0].formatted_address,
    latitude: response.data.results[0].geometry.location.lat,
    longitude: response.data.results[0].geometry.location.lng
  }

  return new Response(JSON.stringify(responseData), { status: 200 });
}