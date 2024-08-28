import { dbConnectionPool } from "@/libs/db";
import { ISelectionCreateTemporaryData } from "@/models/selection.model";
import { createTemporarySelection } from "@/services/selectionCreate.services";
import { prepareAndValidateTemporarySelectionCreateFormData } from "@/services/selectionCreate.validation";
import { getTokenForAuthentication } from "@/utils/authUtils";
import { BadRequestError, InternalServerError, UnauthorizedError } from "@/utils/errors";
import { logWithIP } from "@/utils/logUtils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  const transaction = await dbConnectionPool.transaction();
  try {
    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다. 다시 로그인 해주세요.");
    }

    const formData : FormData = await request.formData();
    // 데이터 유효성 검사
    const data : ISelectionCreateTemporaryData = await prepareAndValidateTemporarySelectionCreateFormData(formData);
    await createTemporarySelection(
      transaction, 
      token.userId as number,
      data
    );

    await transaction.commit();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    const errorMsg = error instanceof InternalServerError ? 
      "서버 내부 오류입니다. 다시 시도해주세요." : (error.message || "알 수 없는 오류입니다.");

    await logWithIP(
      'POST /api/temporary-selections - ' + error.message,
      request,
      'error'
    );
    await transaction.rollback();
    return NextResponse.json(
      { error: errorMsg }, 
      { status: error.statusCode || 500 }
    );
  } 
};