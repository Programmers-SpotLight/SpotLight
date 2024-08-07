import axios from "axios";
import { NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const latitude : string | null = searchParams.get("latitude");
  const longitude : string | null = searchParams.get("longitude");

  if (!latitude || !longitude) {
    return new Response("Please provide latitude and longitude", { status: 400 });
  }

  if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
    return new Response("Latitude and longitude must be numbers", { status: 400 });
  }

  const API_URL_PART1 = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}`;
  const API_URL_PART2 = `&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=ko&result_type=street_address`;

  const response = await axios.get(API_URL_PART1 + API_URL_PART2);
  if (response.status !== 200) {
    return new Response("Failed to fetch reverse geocoding data", { status: 500 });
  }

  const newResponse : {formatted_address: string, place_id: string} = {
    formatted_address: response.data.results[0].formatted_address,
    place_id: response.data.results[0].place_id
  };

  return new Response(JSON.stringify(newResponse), { status: 200 });
}