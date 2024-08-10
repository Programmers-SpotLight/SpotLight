import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import Image from "next/image";
import React from "react";
import { useStore } from "zustand";


interface ISelectionCreateHashtagsListItemProps {
  hashtag: string;
}

const SelectionCreateHashtagsListItem : React.FC<ISelectionCreateHashtagsListItemProps> = ({ 
  hashtag, 
}) => {
  const { deleteHashtag } = useStore(useSelectionCreateStore);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteHashtag(hashtag);
  }

  return (
    <div className="px-5 py-2 w-fit border border-solid border-grey3 rounded-full flex items-center gap-3">
      {hashtag}
      <button onClick={handleClick}>
        <Image
          src={"/icons/clear_7C7C7C.svg"}
          width={16}
          height={16}
          alt="clear"
        />
      </button>
    </div>
  );
};

export default SelectionCreateHashtagsListItem;