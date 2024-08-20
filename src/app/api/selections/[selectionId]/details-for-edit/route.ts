import { getSelectionForEdit } from "@/services/selectionEdit.services";
import { NextRequest } from "next/server";


export async function GET(
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

  try {
    const selectionDetail = await getSelectionForEdit(selectionId);
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
    return new Response(
      error.message,
      {
        status: error.statusCode || 500,
        headers: {
          "Content-Type": "text/plain"
        }
      }
    );
  }
}