import { dbConnectionPool } from "@/libs/db";
import { 
  ISelectionCreateCompleteData, 
  ISelectionCreateTemporaryData, 
  TSelectionCreateFormData 
} from "@/models/selection.model";
import { 
  createSelection,
  createTemporarySelection,
  prepareSelectionCreateFormData, 
  validateData } from "@/services/selection.services";
import { NextRequest } from "next/server";


export const POST = async (request: NextRequest) => {
  // TASK-TO-DO: Add the logic to handle the user authentication prior to proceeding with the request
  const formData : FormData = await request.formData();
  const data : TSelectionCreateFormData = await prepareSelectionCreateFormData(formData);

  const transaction = await dbConnectionPool.transaction();
  try {
    // 데이터 유효성 검사
    await validateData(data);
    const status = data.status;

    if (status != 'temp') {
      await createSelection(transaction, data as ISelectionCreateCompleteData);
    } else {
      await createTemporarySelection(transaction, data as ISelectionCreateTemporaryData);
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