import Button from "@/components/common/button/Button";
import { useModalStore } from "@/stores/modalStore";

interface IReviewEmptyProp {
  openModal: () => void;
}

const ReviewEmpty = ({ openModal }: IReviewEmptyProp) => {
  return (
    <div className="flex justify-center items-center">
      <Button size="large" onClick={openModal}>✨ 첫 번쨰 리뷰를 달아주세요 ✨</Button>
    </div>
  );
};

export default ReviewEmpty;