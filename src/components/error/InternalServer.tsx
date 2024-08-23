import Button from "../common/button/Button";
import { useStore } from "zustand";
import { useModalStore } from "@/stores/modalStore";
import Image from "next/image";
import bg from "../../../public/imgs/error/500.jpeg";
import Link from "next/link";

const InternalServer = () => {
  const { openModal } = useStore(useModalStore);

  const openFeedbackForm = () => {
    openModal("feedback");
  };

  return (
    <div className="w-full h-full relative">
      <Image src={bg} alt="500" fill priority />
      <p className="text-8xl text-white absolute left-1/2 -translate-x-1/2 top-20">
        500 ERROR
      </p>
      <p className="text-large text-white absolute left-1/2 -translate-x-1/2 bottom-28">
        불편을 드려 죄송합니다. 서버에서 오류가 발생하였습니다. 잠시 후 다시
        시도해주세요.
      </p>
      <p className="text-white absolute left-1/2 -translate-x-1/2 bottom-20">
        계속해서 문제가 발생할 경우 하단의 문의하기를 통해 알려주세요.
      </p>
      <div className="flex gap-4 absolute left-1/2 -translate-x-1/2 bottom-8">
        <Button size="large" color="white" onClick={openFeedbackForm}>
          문의하기
        </Button>
        <Link href={"/"}>
          <Button size="large">홈으로</Button>
        </Link>
      </div>
    </div>
  );
};

export default InternalServer;
