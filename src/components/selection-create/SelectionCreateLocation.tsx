import React from "react";
import { ISelectionLocation } from "@/models/selection.model";
import { useStore } from "zustand";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import DoubleDropdown from "../common/DoubleDropdown";


interface ISelectionCreateLocation {
  selectionLocations : ISelectionLocation[]
}

const SelectionCreateLocation : React.FC<ISelectionCreateLocation> = ({
  selectionLocations, 
}) => {
  const { 
    location,
    subLocation,
    setLocation : setSelectionCreateLocation,
    setSubLocation: setSelectionCreateSubLocation
  } = useStore(useSelectionCreateStore);

  const handleFirstOptionClick = (id: number | string, name: string) => {
    if (typeof id === "string") {
      return setSelectionCreateLocation(undefined);
    }
    setSelectionCreateLocation({
      id,
      name
    });
  }

  const handleSecondOptionClick = (id: number | string, name: string) => {
    if (typeof id === "string") {
      return setSelectionCreateSubLocation(undefined);
    }
    setSelectionCreateSubLocation({
      id,
      name
    });
  }

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center w-2/3">
        <label htmlFor="location" className="w-1/4 text-medium font-bold">
          지역 설정
        </label>
        <DoubleDropdown
          title="지역"
          contents={selectionLocations}
          onFirstOptionClick={handleFirstOptionClick}
          onSecondOptionClick={handleSecondOptionClick}
          initialValue={subLocation?.name || location?.name}
        />
      </div>
      <p className="text-grey4 text-small w-1/3">
        스팟들을 아우르는 지역을 선택해주세요
      </p>
    </div>
  );
};

export default SelectionCreateLocation;
