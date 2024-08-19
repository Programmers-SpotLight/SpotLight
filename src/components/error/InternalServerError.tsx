import React from "react";
import { GrServer } from "react-icons/gr";
import Button from "../common/button/Button";
import { useStore } from "zustand";
import { useModalStore } from "@/stores/modalStore";

const InternalServerError = () => {
  const { openModal } = useStore(useModalStore);

  const openFeedbackForm = () => {
    openModal("feedback");
  };

  const onBackClickHandler = () => {
    window.history.back();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <GrServer size={300} />
      <span className="text-6xl">500</span>
      <span className="text-3xl">Internal Server Error</span>
      <span className="text-large text-grey4">
        불편을 드려 죄송합니다. 서버에서 오류가 발생하였습니다. 잠시 후 다시
        시도해주세요.
      </span>
      <span className="text-large text-grey4">
        계속해서 문제가 발생할 경우 하단의 문의하기를 통해 알려주세요.
      </span>

      <div className="flex gap-4">
        <Button size="large" color="white" onClick={openFeedbackForm}>
          문의하기
        </Button>
        <Button size="large" onClick={onBackClickHandler}>
          이전으로
        </Button>
      </div>
    </div>
  );
};

export default InternalServerError;
