import axios from "axios";
import { NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query : string | null = searchParams.get("query");

  if (query === null) {
    return new Response("Please provide a query", { status: 400 });
  }

  const API_URL = 'https://places.googleapis.com/v1/places:searchText';
  const inputData = {
    textQuery: query,
    languageCode: 'ko',
  };

  try {
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

    return new Response(JSON.stringify(response.data.places), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: error.statusCode || 500 });
  }
};