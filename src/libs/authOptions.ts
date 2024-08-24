import { getUserInfoByUid } from "@/services/user.services";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import { dbConnectionPool } from "./db";


export default function authOptions(): NextAuthOptions {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      }),
      KakaoProvider({
        clientId: process.env.KAKAO_CLIENT_ID!,
        clientSecret: process.env.KAKAO_CLIENT_SECRET!
      })
    ],
    session: {
      strategy: "jwt"
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          const userDBInfo: Array<{ [key: string]: any }> =
            await getUserInfoByUid(user.id);
          if (userDBInfo.length === 1) {
            token.userId = userDBInfo[0].user_id;
            token.nickname = userDBInfo[0].user_nickname;
            if (userDBInfo[0].user_img) {
              token.userImage = userDBInfo[0].user_img;
            }
          } else {
            token.nickname = user.id;
          }
          token.id = user.id; // Kakao ID
        }
        return token;
      },

      async session({ session, token }) {
        session.user = {
          ...session.user,
          id: token.userId,
          name: token.nickname as string,
          image: token.userImage as string | null
        };
        return session;
      },
      async signIn({ user, account, profile }) {
        const uid = user.id;

        const existingUser = await dbConnectionPool("user")
          .where({ user_uid: uid, user_type: account?.provider })
          .first();

        if (existingUser) {
          return true; // 기존 사용자일 경우 로그인 허용
        } else {
          return "/?uid=" + uid + "&provider=" + account?.provider;
        }
      },
      async redirect({ url, baseUrl }) {
        return url.startsWith(baseUrl) ? url : baseUrl;
      }
    },
    pages: {
      signIn: "",
      signOut: "/auth/signout",
      error: "/auth/error" // 24-08-14 기준 페이지 미구현
    }
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
  };
}