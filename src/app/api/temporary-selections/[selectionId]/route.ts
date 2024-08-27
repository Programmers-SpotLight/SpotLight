import { dbConnectionPool } from "@/libs/db";
import { ISelectionCreateTemporaryData } from "@/models/selection.model";
import { prepareAndValidateTemporarySelectionCreateFormData } from "@/services/selectionCreate.validation";
import { editSelectionTemporary, getTemporarySelectionForEdit } from "@/services/selectionEdit.services";
import { getTokenForAuthentication } from "@/utils/authUtils";
import { BadRequestError, InternalServerError, UnauthorizedError } from "@/utils/errors";
import { logWithIP } from "@/utils/logUtils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: { selectionId: number } }
) {
  try {
    const token = await getTokenForAuthentication(req);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }

    const selectionId = params.selectionId;
    if (!selectionId) {
      throw new BadRequestError("셀렉션 ID가 없습니다.");
    }
    if (isNaN(selectionId)) {
      throw new BadRequestError("셀렉션 ID가 숫자가 아닙니다.");
    }
    
    const selectionDetail = await getTemporarySelectionForEdit(
      token.userId as number,
      selectionId
    );

    return NextResponse.json(selectionDetail, { status: 200 });
  } catch (error: any) {
    await logWithIP(
      'GET /api/temporary-selections/%5BselectionId%5D - ' + error.message,
      req,
      'error'
    );

    return NextResponse.json(
      { error: error.message }, 
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { selectionId: number } }
) {
  const transaction = await dbConnectionPool.transaction();
  try {
    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }

    const selectionId = params.selectionId;
    if (!selectionId) {
      throw new BadRequestError("셀렉션 ID가 없습니다.");
    }
    if (isNaN(selectionId)) {
      throw new BadRequestError("셀렉션 ID가 숫자가 아닙니다.");
    }

    const formData : FormData = await request.formData();
    // 데이터 유효성 검사
    const data : ISelectionCreateTemporaryData = await prepareAndValidateTemporarySelectionCreateFormData(formData);
    await editSelectionTemporary(
      transaction, 
      token.userId as number,
      selectionId, 
      data
    );

    await transaction.commit();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const errorMsg = error instanceof InternalServerError ? 
      "서버 내부 오류입니다. 다시 시도해주세요." : (error.message || "알 수 없는 오류입니다.");

    await logWithIP(
      'PUT /api/temporary-selections/%5BselectionId%5D - ' + error.message,
      request,
      'error'
    );

    await transaction.rollback();
    return NextResponse.json(
      { error: errorMsg },
      { status: error.statusCode || 500 }
    );
  } 
}