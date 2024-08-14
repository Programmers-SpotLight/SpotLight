"use client";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import UserNavigation from "@/components/user/my/UserNavigation";
import UserInfoWidget from "@/components/user/UserInfoWidget";
import { useFetchUserInfo } from "@/hooks/queries/useFetchUserInfo";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const userIdMatch = pathname.match(/user\/(\d+)/);
  if (!userIdMatch) return null;
  const userId = userIdMatch[1];
  const isMyPage = true;
  const {data, isLoading, isError} = useFetchUserInfo(userId)

  if(!data) return null;
  if(isLoading) return <div className="w-[1024px] flex justify-center items-center"><SearchLoading/></div>
  if(isError) return <div>에러페이지입니다</div>

  return (  
    <div className="w-[1024px] flex flex-col m-auto border border-solid border-grey2 bg-grey0 ">
        <UserInfoWidget {...data} isMyPage={isMyPage} userId={userId} />
        <div className="flex">
        {isMyPage && <UserNavigation/>}
        {children}
        </div>
    </div>
  );
}
