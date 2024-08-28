import type { Metadata } from "next";
import "./globals.css";
import ClientRoot from "./ClientRoot";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "SpotLight",
  description:
    "SpotLight는 사용자가 자신의 최애 장소를 기록한 셀렉션을 공유하고, 이에 대한 검색을 제공하는 지도 중심의 커뮤니티 웹사이트입니다.",
  icons: {
    icon: "/imgs/SpotLightLogo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
