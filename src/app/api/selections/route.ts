import { dbConnectionPool } from "@/libs/db";
import { ISelectionCreateFormData } from "@/models/selection.model";
import { 
  createHashtags,
  createSelection,
  saveSelectionImage,
  prepareSelectionCreateFormData, 
  validateData } from "@/services/selection.services";
import { NextRequest } from "next/server";


export const POST = async (request: NextRequest) => {
  // TASK-TO-DO: Add the logic to handle the user authentication prior to proceeding with the request
  const formData : FormData = await request.formData();
  const data : ISelectionCreateFormData = await prepareSelectionCreateFormData(formData);

  const errorMsg : string | null = await validateData(data);
  console.log('Error:', errorMsg);
  if (errorMsg) {
    return new Response(errorMsg, {
      status: 400,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  if (data.img instanceof File) {
    const filePath = await saveSelectionImage(data.img);
    data.img = filePath;
  }

  const transaction = await dbConnectionPool.transaction();
  try {
    // 해당 해시태그가 존재하지 않으면 새로 생성
    if (data.hashtags) {
      data.hashtags = await createHashtags(transaction, data.hashtags as string[]);
    }
    // 각 spot에 대해 해시태그 생성
    if (data.spots) {
      for (let i = 0; i < data.spots.length; i++) {
        const spot = data.spots[i];
        data.spots[i].hashtags = await createHashtags(transaction, spot.hashtags as string[]);
      }
    }
    // 셀렉션 생성
    await createSelection(transaction, data);
  } catch (error: any) {
    await transaction.rollback();
    return new Response(error.message, {
      status: 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  } finally {
    await transaction.commit();
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};