import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req });

  if (!token) {
    if (req.nextUrl.pathname === '/api/selections') {
      return new NextResponse('Authentication Error', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // 수정 필요
  matcher: [
    '/api/selections',
  ],
};