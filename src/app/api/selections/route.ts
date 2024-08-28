import { dbConnectionPool } from "@/libs/db";
import { 
  ISelectionCreateCompleteData, 
} from "@/models/selection.model";
import { deleteTemporarySelectionWhereIdEqual } from "@/repositories/selection.repository";
import { 
  createSelection,
} from "@/services/selectionCreate.services";
import { 
  prepareAndValidateSelectionCreateFormData,
} from "@/services/selectionCreate.validation";
import { getTokenForAuthentication } from "@/utils/authUtils";
import { InternalServerError, UnauthorizedError } from "@/utils/errors";
import { logWithIP } from "@/utils/logUtils";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (request: NextRequest) => {
  const transaction = await dbConnectionPool.transaction();

  try {
    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }

    const formData : FormData = await request.formData();
    formData.append("userId", String(token.userId));
    // 데이터 유효성 검사
    const data : ISelectionCreateCompleteData = await prepareAndValidateSelectionCreateFormData(formData);
    await createSelection(
      transaction, 
      token.userId as number,
      data
    );

    if (data.temp_id) {
      await deleteTemporarySelectionWhereIdEqual(transaction, data.temp_id);
    }

    await transaction.commit();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    const errorMsg = error instanceof InternalServerError ? 
      "서버 내부 오류입니다. 다시 시도해주세요." : (error.message || "알 수 없는 오류입니다.");

    await logWithIP(
      'POST /api/selections - ' + error.message,
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