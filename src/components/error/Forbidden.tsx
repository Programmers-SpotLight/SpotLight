import React from "react";
import Button from "../common/button/Button";
import Link from "next/link";
import { RiUserForbidFill } from "react-icons/ri";
const Forbidden = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <RiUserForbidFill size={300} fill="red" />
      <p className="text-large text-grey4">
        죄송합니다. 해당 페이지에 대한 엑세스 권한이 없습니다.
      </p>
      <p className="text-grey4">
        다른 계정으로 로그인하거나 관리자에게 문의해주세요.
      </p>

      <Link href={"/"}>
        <Button size="large">홈으로</Button>
      </Link>
    </div>
  );
};

export default Forbidden;
