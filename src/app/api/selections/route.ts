import { dbConnectionPool } from "@/libs/db";
import { ISelectionCreateFormData } from "@/models/selection.model";
import { 
  createSelection,
  prepareSelectionCreateFormData, 
  validateData } from "@/services/selection.services";
import { NextRequest } from "next/server";


export const POST = async (request: NextRequest) => {
  // TASK-TO-DO: Add the logic to handle the user authentication prior to proceeding with the request
  const formData : FormData = await request.formData();
  const data : ISelectionCreateFormData = await prepareSelectionCreateFormData(formData);

  const transaction = await dbConnectionPool.transaction();
  try {
    // 데이터 유효성 검사
    await validateData(data);

    await createSelection(transaction, data);
    await transaction.commit();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    await transaction.rollback();
    return new Response(error.message, {
      status: error.statusCode || 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  } 
};