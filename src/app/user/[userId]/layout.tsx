"use client";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import UserNavigation from "@/components/user/my/UserNavigation";
import PrivateUser from "@/components/user/other-user/PrivateUser";
import UserInfoWidget from "@/components/user/UserInfoWidget";
import { UserPageProvider } from "@/context/UserPageContext";
import {
  useFetchUserHashtag,
  useFetchUserInfo
} from "@/hooks/queries/useFetchUserInfo";
import useErrorComponents from "@/hooks/useErrorComponents";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const userId = params.userId.toString();
  const { data: session } = useSession();

  const isMyPage = session?.user.id === parseInt(userId, 10);
  const {
    data: infoData,
    isLoading: infoLoading,
    isError: isInfoError,
    error: infoError
  } = useFetchUserInfo(userId);
  const {
    data: hashData,
    isLoading: hashLoading,
    isError: isHashError,
    error: hashError
  } = useFetchUserHashtag(userId);

  const infoErrorComponent = useErrorComponents(infoError);

  if (isInfoError || isHashError) {
    return infoErrorComponent;
  }

  if (infoLoading || hashLoading)
    return (
      <div className="w-[1024px] h-[calc(100vh-270px)] mx-auto">
        <SearchLoading
          height="full"
          loadingMessage="사용자 정보를 불러오는 중입니다."
        />
      </div>
    );

  if (!infoData || !hashData) return null;

  if (infoData.is_private)
    return (
      <div className="w-[1024px] h-[calc(100vh-266px)] mx-auto ">
        <PrivateUser />
      </div>
    );

  return (
    <UserPageProvider isMyPage={isMyPage}>
      <div className="w-[1024px] flex flex-col m-auto border border-solid border-grey2 bg-grey0">
        <UserInfoWidget
          {...infoData}
          userId={userId}
          hashtags={hashData.data}
        />
        <div className="flex">
          {isMyPage && <UserNavigation />}
          {children}
        </div>
      </div>
    </UserPageProvider>
  );
}
