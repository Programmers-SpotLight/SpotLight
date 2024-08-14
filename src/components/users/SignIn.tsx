'use client';

import React, { useEffect, useState } from 'react'
import { getProviders, signIn, signOut } from "next-auth/react";
import Button from '../common/button/Button'

const handleKakaoSignIn = () => {
  signIn("kakao", {
    redirect: false,
    callbackUrl: "http://localhost:3000/api/auth/callback/kakao",
  })
  .then((result) => {
    // console.log("Sign-in successful:", result);
  })
  .catch((error) => {
    // console.error("Sign-in error:", error);
  });
};

// 제공자의 타입 정의
type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};
// getProviders 함수의 반환 타입 정의
type ProvidersResponse = Record<string, Provider>;

const SignIn = () => {
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);

  useEffect(() => {
    getProviders()
      .then((res: any) => {
        console.log(res);
        setProviders(res);
      })
      .catch((error) => {
        console.error("Failed to get providers:", error);
      });
  }, []);

  return (
    <div>
      <Button onClick={handleKakaoSignIn}>카카오 로그인</Button>
      <Button onClick={signOut}>로그아웃</Button>
    </div>
  )
}

export default SignIn;