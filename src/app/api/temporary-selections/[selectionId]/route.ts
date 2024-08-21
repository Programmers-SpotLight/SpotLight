import { dbConnectionPool } from "@/libs/db";
import { ISelectionCreateTemporaryData } from "@/models/selection.model";
import { prepareAndValidateTemporarySelectionCreateFormData } from "@/services/selectionCreate.validation";
import { editSelectionTemporary, getTemporarySelectionForEdit } from "@/services/selectionEdit.services";
import { getTokenForAuthentication } from "@/utils/authUtils";
import { UnauthorizedError } from "@/utils/errors";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: { selectionId: number } }
) {
  const selectionId = params.selectionId;

  if (!selectionId) {
    return new Response(
      JSON.stringify({ error: "Invalid selection ID" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  if (isNaN(selectionId)) {
    return new Response(
      JSON.stringify({ error: "Invalid selection ID" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    const token = await getTokenForAuthentication(req);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
    }
    
    const selectionDetail = await getTemporarySelectionForEdit(
      token.userId as number,
      selectionId
    );
    return new Response(
      JSON.stringify(selectionDetail),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(error.message, {
      status: error.statusCode || 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { selectionId: number } }
) {
  const selectionId = params.selectionId;

  if (!selectionId) {
    return new Response(
      JSON.stringify({ error: "Invalid selection ID" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  if (isNaN(selectionId)) {
    return new Response(
      JSON.stringify({ error: "Invalid selection ID" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  const transaction = await dbConnectionPool.transaction();
  try {
    const token = await getTokenForAuthentication(request);
    if (!token.userId) {
      throw new UnauthorizedError("userId가 token에 없습니다.");
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
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    await transaction.rollback();
    console.error(error);
    return new Response(error.message, {
      status: error.statusCode || 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  } 
}