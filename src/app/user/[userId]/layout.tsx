"use client";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import UserNavigation from "@/components/user/my/UserNavigation";
import PrivateUser from "@/components/user/other-user/PrivateUser";
import UserInfoWidget from "@/components/user/UserInfoWidget";
import { UserPageProvider } from "@/context/UserPageContext";
import { useFetchUserInfo } from "@/hooks/queries/useFetchUserInfo";
import { usePathname } from "next/navigation";
import React from "react";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const userIdMatch = pathname.match(/user\/(\d+)/);
  if (!userIdMatch) return null;
  const userId = userIdMatch[1];
  const isMyPage = false;
  const { data, isLoading, isError } = useFetchUserInfo(userId);

  if (!data) return null;
  if (isLoading)
    return (
      <div className="w-[1024px] flex justify-center items-center">
        <SearchLoading height="full" />
      </div>
    );
  if (isError) return <div>에러페이지입니다</div>;

  if (data.is_private)
    return (
      <div className="w-[1024px] h-[calc(100vh-266px)] mx-auto ">
        <PrivateUser />
      </div>
    );

  return (
    <UserPageProvider isMyPage={isMyPage}>
      <div className="w-[1024px] flex flex-col m-auto border border-solid border-grey2 bg-grey0">
        <UserInfoWidget {...data} userId={userId} />
        <div className="flex">
          {isMyPage && <UserNavigation />}
          {children}
        </div>
      </div>
    </UserPageProvider>
  );
}
