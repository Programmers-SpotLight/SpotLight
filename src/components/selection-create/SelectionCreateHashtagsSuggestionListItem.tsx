import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";

interface ISelectionCreateHashtagsSuggestionListItemProps {
  hashtag: string;
  onHashtagDeleteClick: (hashtag: string) => void;
}

const SelectionCreateHashtagsSuggestionListItem = (
  { hashtag, onHashtagDeleteClick }: ISelectionCreateHashtagsSuggestionListItemProps
) => {
  const { addHashtag, hashtags } = useStore(useSelectionCreateStore);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hashtags.includes(hashtag)) {
      alert('이미 추가된 해시태그입니다.');
      onHashtagDeleteClick(hashtag);
      return;
    }

    addHashtag(hashtag);
    onHashtagDeleteClick(hashtag);
  };

  return (
    <button 
      className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full cursor-pointer" 
      onClick={handleClick}
    >
      {hashtag}
    </button>
  );
}

export default SelectionCreateHashtagsSuggestionListItem;