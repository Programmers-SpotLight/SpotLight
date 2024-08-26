import { checkIfSelectionHasReviews } from "@/repositories/selection.repository";
import { getSelectionForEdit } from "@/services/selectionEdit.services";
import { getTokenForAuthentication } from "@/utils/authUtils";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "@/utils/errors";
import { logWithIP } from "@/utils/logUtils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { selectionId: number } }
) {
  try {
    const selectionId = params.selectionId;
    if (!selectionId) {
      throw new BadRequestError("셀렉션 ID가 없습니다.");
    }
    if (isNaN(selectionId)) {
      throw new BadRequestError("셀렉션 ID가 숫자가 아닙니다.");
    }

    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }

    const selectionDetail = await getSelectionForEdit(
      token.userId as number,
      selectionId
    );

    const hasReview = await checkIfSelectionHasReviews(selectionId);
    if (hasReview) {
      throw new ForbiddenError("해당 셀렉션에 리뷰가 존재합니다.");
    }

    return NextResponse.json(selectionDetail, { status: 200 });
  } catch (error: any) {
    await logWithIP(
      'GET /api/selections/:selectionId - ' + error.message,
      request,
      'error'
    );

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}