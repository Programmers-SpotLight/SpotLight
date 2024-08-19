import Image from "next/image";
import React from "react";
import notFound from "../../../public/imgs/404page.jpeg";
import Button from "../common/button/Button";
import Link from "next/link";
const NotFound = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div className="w-1/2 h-1/2 relative">
        <Image src={notFound} alt="not found" fill />
      </div>
      <p className="font-bold text-large text-grey4">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link href={"/"}>
        <Button size="large">홈으로</Button>
      </Link>
    </div>
  );
};

export default NotFound;
