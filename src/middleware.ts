import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req });

  if (!token) {
    if (req.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // 수정 필요
  matcher: [
    '/api/mypage/:path*',
    '/api/users/:user-id(\\d+)/:path*',
    '/api/selections/:path*',
    '/api/selections/:selection-id(\\d+)',
  ],
};