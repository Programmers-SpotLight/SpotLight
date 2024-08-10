import useFetchSelectionLocations from "@/hooks/queries/useFetchSelectionLocations";
import React, { Dispatch, SetStateAction } from "react";
import { ISelectionLocation } from "@/models/selection.model";
import Dropdown from "../common/Dropdown";

interface ISelectionCreateLocation {
  selectionLocations : ISelectionLocation[]
  setLocation: Dispatch<SetStateAction<{
    location: undefined | {
        id: number;
        name: string;
    };
    subLocation: undefined | {
        id: number;
        name: string;
    };
}>>
}
const SelectionCreateLocation = ({selectionLocations, setLocation} : ISelectionCreateLocation) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="location" className="w-1/4 text-medium font-bold">
          지역 설정
        </label>
        <Dropdown title="지역" 
        contents={selectionLocations}
        setLocation={setLocation} />
      </div>
      <p className="text-grey4 text-small w-1/3">
        스팟들을 아우르는 지역을 선택해주세요
      </p>
    </div>
  );
};

export default SelectionCreateLocation;
