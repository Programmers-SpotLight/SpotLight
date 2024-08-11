import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import React from "react";
import { useStore } from "zustand";
import SelectionCreateHashtagsListItem from "./SelectionCreateHashtagsListItem";


const SelectionCreateHashtagsList : React.FC= () => {
  const { hashtags } = useStore(useSelectionCreateStore);

  return (
    <div className="text-small">
      <p className="text-grey4">해시태그는 총 8개까지 등록 가능합니다</p>
      <div className="flex gap-2 mt-4 text-grey3 overflow-x-auto flex-wrap">
        {hashtags.map((hashtag, index) => (
          <SelectionCreateHashtagsListItem
            key={index}
            hashtag={hashtag}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectionCreateHashtagsList;