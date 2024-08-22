"use client";

import React, { FormEvent, useState } from "react";
import TextAreaInput from "../../input/TextAreaInput";
import Button from "../../button/Button";
import { useModalStore } from "@/stores/modalStore";
import { toast } from "react-toastify";
import useUpdateUserDescription from "@/hooks/mutations/useUpdateUserDescription";

interface ModalEditInfoProps {
  userId: string;
  description: string;
}

const ModalEditInfo = ({ description, userId }: ModalEditInfoProps) => {
  const [text, setText] = useState<string>(description);
  const { closeModal } = useModalStore();
  const { userUpd } = useUpdateUserDescription(userId, text);

  const onClickSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length === 0) {
      return;
    }
    if (text.length > 50) {
      toast.error("50자 이내로 작성해주세요");
      return;
    }
    userUpd();
    closeModal();
  };

  return (
    <div>
      <form onSubmit={(e) => onClickSubmit(e)}>
        <TextAreaInput
          placeholder="회원님을 50자 이내로 간략하게 소개해주세요!"
          width="medium"
          height="large"
          className="text-small font-light"
          value={text}
          onTextChange={(e) => setText(e)}
        />
        <div className="flex gap-[10px] justify-center items-center mt-5">
          <Button
            type="button"
            color="white"
            size="medium"
            onClick={closeModal}
          >
            취소
          </Button>
          <Button type="submit" color="primary" size="medium">
            등록
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModalEditInfo;
