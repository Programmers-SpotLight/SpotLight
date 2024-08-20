import Image from "next/image";
import bg from "../../../public/imgs/404.jpeg";
import Button from "../common/button/Button";
import Link from "next/link";
const NotFound = () => {
  return (
    <div className="w-full h-full relative">
      <Image src={bg} alt="404" fill priority />
      <p className="text-8xl text-white absolute left-1/2 -translate-x-1/2 top-20">
        404 ERROR
      </p>

      <p className="text-large text-white absolute left-1/2 -translate-x-1/2 bottom-28">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <p className="text-white  absolute left-1/2 -translate-x-1/2 bottom-20">
        다른 계정으로 로그인하거나 관리자에게 문의해주세요.
      </p>

      <Link href={"/"} className="absolute left-1/2 -translate-x-1/2 bottom-8">
        <Button size="large" color="white">
          홈으로
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
