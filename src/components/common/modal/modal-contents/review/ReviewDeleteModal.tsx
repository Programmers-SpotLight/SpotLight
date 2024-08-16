import { useModalStore } from "@/stores/modalStore";
import React from "react";
import Button from "@/components/common/button/Button";

interface ImodalProps {
  reviewId: string;
  onSubmit: (reviewId: string) => void;
}

const ReviewDeleteModal = ({ reviewId, onSubmit }: ImodalProps) => {
  const closeModal = useModalStore((state) => state.closeModal);

  const handleSubmit = () => {
    onSubmit(reviewId);
    closeModal();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center text-medium font-extrabold">작성한 리뷰를 정말로 삭제하시겠습니까?</div>
      <div className="flex items-center justify-center text-extraSmall text-grey4">
        삭제 후에는 해당 리뷰의 모든 정보가 영구적으로 제거되며 되돌릴 수 없습니다.
      </div>
      <div className="flex justify-center space-x-2">
        <Button type="button" size="small" color="white" onClick={closeModal}>취소</Button>
        <Button type="submit" size="small" color="primary" onClick={handleSubmit}>삭제</Button>  
      </div>
    </div>
  );
};

export default ReviewDeleteModal;