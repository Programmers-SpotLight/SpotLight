import { IModalCreateSelectionSpotExtraData, ISelectionSpotCategory } from "@/models/selection.model";
import { useModalStore } from "@/stores/modalStore";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import Image from "next/image";
import React from "react";
import { useStore } from "zustand";
import SelectionCreateSpotItem from "./SelectionCreateSpotItem";
import useModalExtraData from "@/hooks/useModalExtraData";


interface ISelectionCreateSpotProps {
  spotCategories: ISelectionSpotCategory[];
}

const SelectionCreateSpot : React.FC<ISelectionCreateSpotProps> = ({
  spotCategories
}) => {
  const { spots } = useStore(useSelectionCreateStore);
  const { openModal } = useStore(useModalStore);
  const { setExtraData } = useModalExtraData<IModalCreateSelectionSpotExtraData>();

  const handleAddSpotClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setExtraData({
      spotCategories,
    });
    openModal('GoogleMapsAddSelectionSpot');
  }

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start grow">
        <label htmlFor="spots" className="w-1/4 text-medium font-bold">스팟 등록</label>
        <div className="w-3/4 relative">
          <button 
            className="w-[50px] h-[50px] top-[50%] right-[-35px] absolute p-5 translate-y-[-50%] rounded-full border border-solid border-grey2 bg-white"
            onClick={handleAddSpotClick}
          >
            <Image
              src="/icons/add_7C7C7C.svg" 
              width={48} 
              height={48} 
              alt="add_spot"
              className="absolute w-1/2 h-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </button>
          <div className="border border-solid border-grey2 w-full h-[190px] rounded-[8px] bg-white flex flex-col items-start gap-6 p-4 overflow-y-auto">
            {/* 스팟 리스트 */}
            {spots.map((spot, index) => (
              <SelectionCreateSpotItem
                key={index}
                index={index}
                spot={spot}
                spotCategories={spotCategories}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between h-[190px] w-1/3">
        <p className="text-grey4 text-small w-full break-keep">사용자에게 제공되는 스팟입니다. 나만 알기 아까운 명소들을 없이 마음 껏 공유하세요!</p>
        <p className="text-red-400 text-small w-full break-keep">사용자에게 제공되는 스팟입니다. 나만 알기 아까운 명소들을 없이 마음 껏 공유하세요!</p>
      </div>
    </div>
  )
}

export default SelectionCreateSpot;