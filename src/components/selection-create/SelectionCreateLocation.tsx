import React, { useEffect, useState } from "react";
import SearchDropdown from "../search/search-contents/SearchDropdown";
import { ISelectionLocation } from "@/models/selection.model";
import { useStore } from "zustand";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";


interface ISelectionCreateLocation {
  selectionLocations : ISelectionLocation[]
}

const SelectionCreateLocation : React.FC<ISelectionCreateLocation> = ({
  selectionLocations, 
}) => {
  const [location, setLocation] = useState<{
    location: {id: number, name: string} | undefined,
    subLocation: {id: number, name: string} | undefined
  }>({location: undefined, subLocation: undefined});

  const { 
    setLocation : setSelectionCreateLocation,
    setSubLocation: setSelectionCreateSubLocation
  } = useStore(useSelectionCreateStore);

  useEffect(() => {
    if (location.location && location.subLocation) {
      setSelectionCreateLocation(location.location);
      setSelectionCreateSubLocation(location.subLocation);
    }
  }, [
    location, 
    setSelectionCreateLocation, 
    setSelectionCreateSubLocation
  ]);

  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="location" className="w-1/4 text-medium font-bold">
          지역 설정
        </label>
        <SearchDropdown 
          title="지역" 
          contents={selectionLocations}
          setLocation={setLocation} 
        />
      </div>
      <p className="text-grey4 text-small w-1/3">
        스팟들을 아우르는 지역을 선택해주세요
      </p>
    </div>
  );
};

export default SelectionCreateLocation;
