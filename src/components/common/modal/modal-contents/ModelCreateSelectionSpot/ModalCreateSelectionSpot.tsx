import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { useModalStore } from '@/stores/modalStore';
import ModalCreateSelectionSpotSearch from './ModalCreateSelectionSpotSearch';
import ModalCreateSelectionSpotInfo from './ModalCreateSelectionSpotInfo';
import ModalCreateSelectionSpotCategory from './ModalCreateSelectionSpotCategory';
import ModalCreateSelectionSpotImages from './ModalCreateSelectionSpotImages';
import ModalCreateSelectionSpotHashtags from './ModalCreateSelectionSpotHashtags';
import ModalCreateSelectionSpotAddButton from './ModalCreateSelectionSpotAddButton';
import { ISelectionSpot } from '@/models/selection.model';


interface IModalCreateSelectionExtraData {
  spotCategories: {id: number, name: string}[]
  spot?: ISelectionSpot
};

const ModalCreateSelectionSpot = () => {
  const modalElementRef = useRef<HTMLDivElement>(null);

  const { 
    extraData : data, 
  } : { 
    extraData: IModalCreateSelectionExtraData | null,
  } = useStore(useModalStore);

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


  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return null;
  }

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