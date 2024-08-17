import { NextRequest } from "next/server";
import { recommendationQueue } from "@/libs/queue";

// Test the recommendationQueue
export async function GET(request: NextRequest) {
  await recommendationQueue.add('recommendation', { message: 'Hello, world!' }); 
  return new Response("Hello, world!");
};