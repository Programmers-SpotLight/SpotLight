import { getToken, JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError } from "./errors";
import { ErrorResponse } from "@/models/user.model";
import { getServerSession } from "next-auth";
import authOptions from "@/libs/authOptions";

export const getTokenForAuthentication = async (req: NextRequest) : Promise<JWT> => {
  const token = await getToken({req});
  if (!token) {
    throw new UnauthorizedError("로그인이 필요합니다");
  }
  return token;
};

export const userIdValidator = async (userId: string): Promise<NextResponse<ErrorResponse> | null> => {
  const session = await getServerSession(authOptions());
  const session_userId = session ? session.user.id : null;
  if (session_userId === null || parseInt(userId) !== session_userId) {
    return NextResponse.json({ error: "사용자 ID가 일치하지 않습니다." }, { status: 403 });
  }

  return null;
};