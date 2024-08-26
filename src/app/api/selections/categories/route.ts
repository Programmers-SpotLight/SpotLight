import { ISelectionCategory } from "@/models/selection.model";
import { getSelectionCategories } from "@/services/selection.services";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    const categories : ISelectionCategory[] = await getSelectionCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "서버 에러가 발생했습니다" },
      { status: error.statusCode || 500 }
    );
  }
};