import React from "react";
import DropdownMenu from "./DropdownMenu";


interface ISelectionCreateLocationProps {
  onLocationChange: (locationValue: string) => void;
  onSubLocationChange: (subLocationValue: string) => void;
  locationOptions: {
    id: number;
    name: string;
    options: {
      id: number;
      name: string;
    }[];
  }[];
  location: {
    location: {
      id: number;
      name: string;
    } | undefined;
    subLocation: {
      id: number;
      name: string;
    } | undefined;
  };
}

const SelectionCreateLocation : React.FC<ISelectionCreateLocationProps> = ({
  onLocationChange,
  onSubLocationChange,
  locationOptions,
  location,
}) => {
  return (
    <div className="flex items-start gap-6 py-6">
      <div className="flex items-center grow">
        <label htmlFor="location" className="w-1/4 text-medium font-bold">지역 설정</label>
        <div className="flex w-3/4 gap-[100px]">
          <DropdownMenu 
            onChange={onLocationChange}
            options={
              locationOptions.map((location) => ({
                value: location.id,
                label: location.name
              }))
            }
          />
          <DropdownMenu 
            onChange={onSubLocationChange}
            options={
              locationOptions.find((loc) => loc.id === location.location?.id)?.options.map((subLocation) => (
                {
                  value: subLocation.id,
                  label: subLocation.name
                }
              ))
            }
            currentChoice={location.subLocation?.name}
          />
        </div>
      </div>
      <p className="text-grey4 text-small w-1/3">스팟들을 아우르는 지역을 선택해주세요</p>
    </div>
  )
};

export default SelectionCreateLocation;