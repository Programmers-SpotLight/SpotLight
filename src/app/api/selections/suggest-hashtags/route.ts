import { requestHashtagsSuggestionFromAI } from "@/services/selectionCreate.services";
import { validateHashtagsSuggestionPrompt } from "@/services/selectionCreate.validation";
import { getTokenForAuthentication } from "@/utils/authUtils";
import { BadRequestError, InternalServerError, UnauthorizedError } from "@/utils/errors";
import { logWithIP } from "@/utils/logUtils";
import { limitAPIUsageWithDuration } from "@/utils/redisUtils";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (request: NextRequest) => {
  try {
    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }

    await limitAPIUsageWithDuration(
      `selection-creation-hashtag-suggestion-${token.userId}`,
      10, 
      '10초에 1번만 해시태그 제안을 받을 수 있습니다. 잠시 후 다시 시도해주세요.'
    );

    const formData : FormData = await request.formData();
    if (formData.has('prompt') === false) {
      throw new BadRequestError("프롬프트가 필요합니다.");
    }

    const prompt = formData.get('prompt') as string;
    await validateHashtagsSuggestionPrompt(prompt);

    const hashtags = await requestHashtagsSuggestionFromAI(prompt);

    return NextResponse.json(hashtags, { status: 200 });
  } catch (error: any) {
    const errorMsg = error instanceof InternalServerError ? 
      "서버 내부 오류입니다. 다시 시도해주세요." : (error.message || "알 수 없는 오류입니다.");

    await logWithIP(
      'POST /api/selections/suggest-hashtags - ' + error.message,
      request,
      'error'
    );

    return NextResponse.json(
      { error: errorMsg }, 
      { status: error.statusCode || 500 }
    );
  }
};