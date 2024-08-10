import { ISelectionCategory } from "@/models/selection.model";
import { getSelectionCategories } from "@/services/selection.services";
import { NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {
  const categories : ISelectionCategory[] = await getSelectionCategories();

  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};