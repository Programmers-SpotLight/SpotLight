import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';


export function GET(req: NextRequest) {
  const url = new URL('/signin', req.url);
  return NextResponse.redirect(url);
}