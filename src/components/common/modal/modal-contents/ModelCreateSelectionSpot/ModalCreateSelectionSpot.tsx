import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { useModalStore } from '@/stores/modalStore';
import ModalCreateSelectionSpotSearch from './ModalCreateSelectionSpotSearch';
import ModalCreateSelectionSpotInfo from './ModalCreateSelectionSpotInfo';
import ModalCreateSelectionSpotCategory from './ModalCreateSelectionSpotCategory';
import ModalCreateSelectionSpotImages from './ModalCreateSelectionSpotImages';
import ModalCreateSelectionSpotHashtags from './ModalCreateSelectionSpotHashtags';
import ModalCreateSelectionSpotAddButton from './ModalCreateSelectionSpotAddButton';
import { IModalCreateSelectionSpotExtraData } from '@/models/selection.model';
import { useSelectionSpotCreateStore } from '@/stores/selectionCreateStore';
import useModalExtraData from '@/hooks/useModalExtraData';


const ModalCreateSelectionSpot = () => {
  const modalElementRef = useRef<HTMLDivElement>(null);
  const resetWhenUnmountRef = useRef<boolean>(false);
  const { closeModal } = useStore(useModalStore);
  const { reset } = useStore(useSelectionSpotCreateStore);

  const {extraData: data} = useModalExtraData<IModalCreateSelectionSpotExtraData>();

  // 모달 창의 높이를 동적으로 조절
  useEffect(() => {
    const handleResize = () => {
      if (modalElementRef.current) {
        const height = window.innerHeight - 200;
        modalElementRef.current.style.height = `${height}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 모달이 닫힐 때 스팟 등록 폼 초기화
  useEffect(() => {
    // StrictMode에서는 useEffect가 두 번 실행되는 문제가 있어서
    // Production 전에는 지우지 않도록 설정
    if (!resetWhenUnmountRef.current) {
      resetWhenUnmountRef.current = true;
      return;
    }

    return () => {
      closeModal();
      reset();
    }
  }, []);

  // 구글 맵 API 키가 없을 때는 렌더링하지 않음
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return null;
  }

  // 스팟 카테고리가 없을 때는 렌더링하지 않음
  if (!data?.spotCategories || data?.spotCategories.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 overflow-y-auto" ref={modalElementRef}>
      <ModalCreateSelectionSpotSearch />
      <ModalCreateSelectionSpotInfo />
      <ModalCreateSelectionSpotCategory 
        spotCategories={data?.spotCategories}
      />
      <ModalCreateSelectionSpotImages />
      <ModalCreateSelectionSpotHashtags />
      <ModalCreateSelectionSpotAddButton />
    </div>
  );
};

export default ModalCreateSelectionSpot;