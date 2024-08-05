import { dbConnectionPool } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const result = await dbConnectionPool.raw("SELECT 1 + 1 AS result");
  console.log(result)

  const url = req.nextUrl;
  const query = url.searchParams;
  const results = await dbConnectionPool('selection').select('*'); // 쿼리 예시
  console.log(results)

  const category = query.get("category") || "0";
  const location = query.get("region") || "0";
  const sort = query.get("sort") || "0";
  const tags = query.getAll("tags") || [];

  console.log(category, location, sort, tags);

  return NextResponse.json({ category, location, sort, tags });
}