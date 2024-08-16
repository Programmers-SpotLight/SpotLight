'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // 추가

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 쿼리 파라미터 가져오기
  const [kakaoId, setKakaoId] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    setKakaoId(searchParams.get('kakaoId'));
    setProvider(searchParams.get('provider'));
  }, [searchParams]);

  const handleSignup = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 사용자 정보 DB에 저장
    const response = fetch('/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_uid: kakaoId,
        user_type: provider,
        user_nickname: nickname,
      })
    }).then((response) => {
      if (response.ok) {
        // 회원가입 완료 후 로그인
        const providerString = Array.isArray(provider) ? provider[0] : provider;
        console.log("providerString", providerString)
        response.json().then(successData => {
          // console.log('회원가입 성공:', successData);
        });
        return signIn(providerString, { callbackUrl: '/' });
      } else {
        response.json().then(errorData => {
          // console.error('회원가입 실패:', errorData);
          throw new Error(errorData.error); // 에러를 던져서 아래에서 처리 가능
        });
      }
    })
    .catch((error) => {
      // console.error('오류 발생:', error);
    });
  };

  return (
    <div>
      <h1>카카오 회원가입</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}