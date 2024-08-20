"use client";

import ModalController from "@/components/common/modal/ModalController";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { getSession, SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function ClientRoot({
  children,
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
      <div className="flex flex-col items-stretch min-h-screen">
        <Header />
        <div className={shouldBeFlex ? "grow flex flex-col" : "grow"}>
          {children}
        </div>
        {showFooter && <Footer />}
      </div>
    </QueryClientProvider>
    </SessionProvider>
  );
}
