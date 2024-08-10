import { QUERY_STRING_NAME } from "@/constants/queryString.constants";
import { getAutoCompleteResult } from "@/services/selectionSearch.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<any>> {
  const url = req.nextUrl;
  const query = url.searchParams;
  const tagValue = query.get(QUERY_STRING_NAME.tagValue);

  if (!tagValue) {
    return NextResponse.json({ data: [] });
  }
  const searchResult = await getAutoCompleteResult(tagValue);
  return NextResponse.json({ data: searchResult || [] });
}
