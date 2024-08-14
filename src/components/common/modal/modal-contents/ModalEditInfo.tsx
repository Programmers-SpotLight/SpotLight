import React from "react";
import TextAreaInput from "../../input/TextAreaInput";
import Button from "../../button/Button";

interface ModalEditInfoProps {
    description: string
}

const ModalEditInfo = ({description} : ModalEditInfoProps) => {
  return (
    <div>
      <form>
        <TextAreaInput
          placeholder="회원님을 30자 이내로 간략하게 소개해주세요!"
          width="medium"
          height="large"
          className="text-small font-light"
        >
            {description }
        </TextAreaInput>
        <div className="flex gap-[10px] justify-center items-center mt-5">
          <Button type="submit" color="white" size="medium">
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
