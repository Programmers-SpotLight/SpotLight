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
import { NextRequest } from "next/server";


export const POST = async (request: NextRequest) => {
  const transaction = await dbConnectionPool.transaction();
  try {
    const formData : FormData = await request.formData();
    // 데이터 유효성 검사
    const data : ISelectionCreateCompleteData = await prepareAndValidateSelectionCreateFormData(formData);
    await createSelection(transaction, data);

    if (data.temp_id) {
      await deleteTemporarySelectionWhereIdEqual(transaction, data.temp_id);
    }

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