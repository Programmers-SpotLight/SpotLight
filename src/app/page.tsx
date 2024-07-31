'use client';

import ModalTemp from "@/components/common/modal/modal-contents/ModalTemp";
import { useModalStore } from "@/stores/modalStore";

export default function Home() {
  const { isOpen, openModal } = useModalStore();

  const handleOpenModal = () => {
    openModal("중간사이즈", "medium", <ModalTemp />);
    console.log('모달', isOpen)
  };

  return (
    <main>
      <p>폰트 변경 테스트 pretendard</p>
      <button 
        className="w-20 h-20 bg-orange-400"
        onClick={handleOpenModal}
      >
        모달 테스트
      </button>
    </main>
  );
}
