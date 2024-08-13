import UserNavigation from "@/components/user/my/UserNavigation";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUser = true;
  return (
    <div className="border border-solid border-grey2 bg-grey0 w-[1024px] m-auto flex">
      {isUser && (
        <div className="top-0 left-0 h-[100vh]">
          <UserNavigation />
        </div>
      )}
      <div className="flex-1 h-full">
        {children}
      </div>
    </div>
  );
}
