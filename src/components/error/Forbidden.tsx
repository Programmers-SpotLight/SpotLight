import Button from "../common/button/Button";
import Link from "next/link";
import bg from "../../../public/imgs/403.jpeg";
import Image from "next/image";

const Forbidden = () => {
  return (
    <div className="w-full h-full relative">
      <Image src={bg} alt="403" fill />
      <p className="text-8xl text-gray-800 absolute left-1/2 -translate-x-1/2 top-20">
        403 ERROR
      </p>

      <p className="text-large text-gray-800 absolute left-1/2 -translate-x-1/2 bottom-28">
        죄송합니다. 해당 페이지에 대한 엑세스 권한이 없습니다.
      </p>
      <p className="text-gray-800 absolute left-1/2 -translate-x-1/2 bottom-20">
        다른 계정으로 로그인하거나 관리자에게 문의해주세요.
      </p>

      <Link href={"/"} className="absolute left-1/2 -translate-x-1/2 bottom-8">
        <Button size="large">홈으로</Button>
      </Link>
    </div>
  );
};

export default Forbidden;
