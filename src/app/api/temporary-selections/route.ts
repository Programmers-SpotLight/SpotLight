import { dbConnectionPool } from "@/libs/db";
import { ISelectionCreateTemporaryData } from "@/models/selection.model";
import { createTemporarySelection } from "@/services/selectionCreate.services";
import { prepareAndValidateTemporarySelectionCreateFormData } from "@/services/selectionCreate.validation";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  const transaction = await dbConnectionPool.transaction();
  try {
    const formData : FormData = await request.formData();
    // 데이터 유효성 검사
    const data : ISelectionCreateTemporaryData = await prepareAndValidateTemporarySelectionCreateFormData(formData);
    await createTemporarySelection(transaction, data);

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
};