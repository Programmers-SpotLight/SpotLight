import { ISelectionSpot } from "@/models/selection.model";
import Image from "next/image";
import React from "react";


interface ISelectionCreateSpotProps {
  spots: ISelectionSpot[];
  onAddSpotClick: (e: React.MouseEvent) => void;
  onDeleteSpotClick: (index: number) => void;
}

const SelectionCreateSpot : React.FC<ISelectionCreateSpotProps> = ({
  spots,
  onAddSpotClick,
  onDeleteSpotClick
}) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-start grow">
        <label htmlFor="spots" className="w-1/4 text-medium font-bold">스팟 등록</label>
        <div className="w-3/4 relative">
          <button 
            className="w-[50px] h-[50px] top-[50%] right-[-35px] absolute p-5 translate-y-[-50%] rounded-full border border-solid border-grey2 bg-white"
            onClick={onAddSpotClick}
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
            <div key={index} className="flex items-center justify-between w-full">
              <div className="flex gap-4 items-center text-medium">
                <Image 
                  src="/icons/move_7C7C7C.svg" 
                  width={1} 
                  height={1} 
                  alt="upload_photo"
                  className="w-[16px] h-[16px]"
                />
                <div className="flex items-center gap-2">
                  <Image
                    src={"/icons/location_on_7C7C7C.svg"}
                    width={16}
                    height={16}
                    alt="location"
                  />
                  {spot.title}
                </div>
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onDeleteSpotClick(index);
                }}>
                  <Image
                    src={"/icons/clear_7C7C7C.svg"}
                    width={16}
                    height={16}
                    alt="clear"
                  />
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between h-[190px] w-1/3">
        <p className="text-grey4 text-small w-full">사용자에게 제공되는 스팟입니다. 나만 알기 아까운 명소들을 없이 마음 껏 공유하세요!</p>
        <p className="text-grey4 text-small w-full">사용자에게 제공되는 스팟입니다. 나만 알기 아까운 명소들을 없이 마음 껏 공유하세요!</p>
      </div>
    </div>
  )
}

export default SelectionCreateSpot;