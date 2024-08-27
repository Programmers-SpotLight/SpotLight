import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';


export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req });

  if (!token) {
    const pathName = req.nextUrl.pathname;
    if (pathName.startsWith('/api') === false) {
      const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/signin';
      return NextResponse.redirect(
        redirectUrl,
        { status: 302 }
      );
    }

    return NextResponse.json(
      { error: '로그인이 필요합니다' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  // 수정 필요
  matcher: [
    '/api/selections/spots/geolocate',
    '/api/selections/spots/reverse-geolocate',
    '/api/selections/spots/search',
    '/api/selections/suggest-hashtags',
    '/api/selections',
    '/api/temporary-selections',
    '/api/temporary-selections/:id(\\d+)',
    '/selection/create',
    '/temporary-selections/:id(\\d+)/edit',
    '/selection/:id(\\d+)/edit'
  ],
};