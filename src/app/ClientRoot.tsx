"use client";

import ModalController from "@/components/common/modal/ModalController";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePathname } from "next/navigation";


export default function ClientRoot({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const pathname = usePathname();
  const showFooter = !/^\/selection\/\d+$/.test(pathname);
  const shouldBeFlex = /\/selection\/create$/.test(pathname);

  return (
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
  );
}
