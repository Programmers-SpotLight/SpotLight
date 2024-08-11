import { requestHashtagsSuggestionFromAI } from "@/services/selection.services";
import { NextRequest } from "next/server";


export const POST = async (request: NextRequest) => {
  const formData : FormData = await request.formData();
  
  if (!formData.has('prompt')) {
    return new Response('프롬프트가 필요합니다.', {
      status: 400,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  try {
    const hashtags = await requestHashtagsSuggestionFromAI(formData.get('prompt') as string);
    return new Response(JSON.stringify(hashtags), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    return new Response(error.message, {
      status: error.statusCode || 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
};