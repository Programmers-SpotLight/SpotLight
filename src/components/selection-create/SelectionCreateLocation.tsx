import useFetchSelectionLocations from "@/hooks/queries/useFetchSelectionLocations";
import React, { Dispatch, SetStateAction } from "react";
import SearchDropdown from "../search/search-contents/SearchDropdown";

interface ILocation {
  id: number;
  name: string;
}
export interface ISelectionCreateLocationState {
  location: ILocation | undefined;
  subLocation: ILocation | undefined;
}

interface ISelectionCreateLocation {
  setLocation: Dispatch<SetStateAction<ISelectionCreateLocationState>>;
}
const SelectionCreateLocation = ({setLocation} : ISelectionCreateLocation) => {
  const {
    data: locationDatas,
    isError: locationError,
    isLoading: locationLoading
  } = useFetchSelectionLocations();

  if (!locationDatas) return null;

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="location" className="w-1/4 text-medium font-bold">
          지역 설정
        </label>
        <SearchDropdown title="지역" 
        contents={locationDatas}
        setLocation={setLocation} />
      </div>
      <p className="text-grey4 text-small w-1/3">
        스팟들을 아우르는 지역을 선택해주세요
      </p>
    </div>
  );
};

export default SelectionCreateLocation;
