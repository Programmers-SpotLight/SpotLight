import Button from "@/components/common/button/Button";
import { useModalStore } from "@/stores/modalStore";

const ReviewEmpty = () => {
  const { openModal } = useModalStore();

  const openReviewAddModal = () => {
    openModal('review'); 
  };

  return (
    <div className="flex justify-center items-center">
      <Button size="large" onClick={openReviewAddModal}>✨ 첫 번쨰 리뷰를 달아주세요 ✨</Button>
    </div>
  );
};

export default ReviewEmpty;