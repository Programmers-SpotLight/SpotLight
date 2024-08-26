import 'server-only';
import { NextRequest } from "next/server";
import logger from '@/libs/winston';
import { getTokenForAuthentication } from './authUtils';
import { JWT } from 'next-auth/jwt';


export type TLogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose' | 'silly';

export const logWithIP = async (
  message: string, 
  request: NextRequest,
  level: TLogLevel
) => {
  if (!checkLogLevel(level)) {
    throw new Error('Invalid log level');
  }

  let token : JWT;
  try {
    token = await getTokenForAuthentication(request);
  } catch (error) {
    token = { userId: null };
  }

  logger.log({
    level,
    message: `${message} IP: ${getUserIP(request)}` + (token.userId ? ` userId: ${token.userId}` : ''),
  });
};
export const checkLogLevel = (level: TLogLevel) => {
  return ['info', 'warn', 'error', 'debug', 'verbose', 'silly'].includes(level);
};

export const getUserIP = (req: NextRequest) => {
  return (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
};