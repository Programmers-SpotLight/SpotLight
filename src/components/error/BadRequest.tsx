import Image from "next/image";
import React from "react";
import bg from "../../../public/imgs/400.jpeg";
import Link from "next/link";
import Button from "../common/button/Button";

const BadRequest = () => {
  return (
    <div className="w-full h-full relative">
      <Image src={bg} alt="400" fill priority />
      <p className="text-8xl text-white absolute left-1/2 -translate-x-1/2 top-20">
        400 ERROR
      </p>
      <p className="text-large text-white absolute left-1/2 -translate-x-1/2 bottom-28">
        죄송합니다. 잘못된 요청이 발생했습니다.
      </p>
      <p className="text-white absolute left-1/2 -translate-x-1/2 bottom-20">
        요청하신 데이터 혹은 매개변수를 다시 한번 확인해주세요
      </p>
      <div className="flex gap-4 absolute left-1/2 -translate-x-1/2 bottom-8">
        <Link href={"/"}>
          <Button size="large">홈으로</Button>
        </Link>
      </div>
    </div>
  );
};

export default BadRequest;
