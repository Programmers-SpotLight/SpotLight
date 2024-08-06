import { dbConnectionPool } from "@/libs/db";
import { ISelectionCategory } from "@/models/selection.model";
import { getSelectionCategories } from "@/services/selection-service";
import { NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {
  const categories : ISelectionCategory[] = await getSelectionCategories(dbConnectionPool);

  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};