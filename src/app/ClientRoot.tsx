"use client";

import ModalController from "@/components/common/modal/ModalController";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { getSession, SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientRoot({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const pathname = usePathname();
  const showFooter = !/^\/(selection\/\d+|other-user\/\d+)$/.test(pathname);
  const shouldBeFlex = [
    /\/selection\/create$/,
    /\/temporary-selections\/\d+\/edit$/,
    /\/selection\/\d+\/edit$/
  ].some((regex) => regex.test(pathname));

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
      // console.log("session 정보 확인 : ", sessionData)
    };
    fetchSession();
  }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ModalController />
        <div className="flex flex-col items-stretch min-h-screen relative">
          <Header />
          <div
            className={
              shouldBeFlex ? "grow flex flex-col relative" : "grow relative"
            }
          >
            {children}
          </div>
          <ToastContainer
            position="top-right" // 알람 위치 지정
            autoClose={2000} // 자동 off 시간
            hideProgressBar={false} // 진행시간바 숨김
            closeOnClick // 클릭으로 알람 닫기
            rtl={false} // 알림 좌우 반전
            pauseOnFocusLoss // 화면을 벗어나면 알람 정지
            draggable // 드래그 가능
            pauseOnHover // 마우스를 올리면 알람 정지
            theme="light"
          />
          {showFooter && <Footer />}
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}
