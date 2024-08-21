import { getToken, JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { UnauthorizedError } from "./errors";

export const getTokenForAuthentication = async (req: NextRequest) : Promise<JWT> => {
  const token = await getToken({req});
  if (!token) {
    throw new UnauthorizedError("로그인이 필요합니다");
  }
  return token;
};