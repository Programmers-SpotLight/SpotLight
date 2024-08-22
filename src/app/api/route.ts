import { NextRequest } from "next/server";
import { manualRecommendationQueue } from "@/libs/queue";
import { getTokenForAuthentication } from "@/utils/authUtils";

// Test the recommendationQueue
export async function GET(request: NextRequest) {
  const token = await getTokenForAuthentication(request);
  await manualRecommendationQueue.add('recommendation', { userId: token.userId }); 
  return new Response("Hello, world!");
};