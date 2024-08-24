import { ISelectionCategory } from "@/models/selection.model";
import { getSelectionCategories } from "@/services/selection.services";
import { NextRequest } from "next/server";


export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    const categories : ISelectionCategory[] = await getSelectionCategories();

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    return new Response(error.message, {
      status: error.statusCode || 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
};