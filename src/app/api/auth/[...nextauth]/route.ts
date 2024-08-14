import NextAuth from 'next-auth/next';
import KakaoProvider from "next-auth/providers/kakao";
import { dbConnectionPool } from '@/libs/db';

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("jwt callback", { token, user});
      if (user) {
        token.id = user.id; // Kakao ID
        token.nickname = user.name; // 사용자 이름 또는 다른 프로필 정보
      }
      return token; // {...token, ...user}
    },

    async session({ session, token }) {
      console.log("session callback", { session, token});
      // session.user = token as any;
      return session;
    },
    async signIn({ user, account, profile }) {
      // 사용자가 로그인할 때의 콜백을 정의.
      console.log("sign in result :", user, account, profile );
      const kakaoId = user.id;
      
      const existingUser = await dbConnectionPool("user")
        .where({ user_uid: kakaoId, user_type: account?.provider })
        .first();

      if (existingUser) {
        return true ; // 기존 사용자일 경우 로그인 허용
      }else{
        return '/signup?kakaoId=' + kakaoId + '&provider=' + account?.provider;
      }
    },
    async redirect({ url, baseUrl }) {
      // 로그인이 완료된 후 리디렉션할 URL을 정의.
      console.log("redirect callback", { url, baseUrl });
      return url.startsWith(baseUrl)
        ? url
        : baseUrl;
    },
  },
  pages:{
      signIn: '/api/users/signin',
      signOut: '/auth/signout',
      error: '/auth/error', // 24-08-14 기준 페이지 미구현
  },
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서만 secure 설정
  //       sameSite: "lax", // SameSite 속성 조정
  //     },
  //   },
  // },
})

export { handler as GET, handler as POST }