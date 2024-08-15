import knex from "knex";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';


interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export function GET(req: NextRequest) {
  const url = new URL('/signin', req.url);
  return NextResponse.redirect(url);
}