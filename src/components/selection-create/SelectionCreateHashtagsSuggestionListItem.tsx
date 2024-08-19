import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import { toast } from "react-toastify";
import { useStore } from "zustand";

interface ISelectionCreateHashtagsSuggestionListItemProps {
  hashtag: string;
  deleteHashtag: (hashtag: string) => void;
}

const SelectionCreateHashtagsSuggestionListItem = ({
  hashtag,
  deleteHashtag
}: ISelectionCreateHashtagsSuggestionListItemProps) => {
  const { addHashtag, hashtags } = useStore(useSelectionCreateStore);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (hashtags.includes(hashtag)) {
      toast.error("이미 추가된 해시태그입니다.");
      deleteHashtag(hashtag);
      return;
    }

    addHashtag(hashtag);
    deleteHashtag(hashtag);
  };

  return (
    <button
      className="px-6 py-2 w-fit border border-solid border-[#02588E] rounded-full cursor-pointer hover:bg-primary hover:text-white"
      onClick={handleClick}
    >
      {hashtag}
    </button>
  );
};

export default SelectionCreateHashtagsSuggestionListItem;
