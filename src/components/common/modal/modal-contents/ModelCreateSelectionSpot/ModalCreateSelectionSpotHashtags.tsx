import Hashtag from "@/components/common/Hashtag";
import { useSelectionSpotCreateStore } from "@/stores/selectionCreateStore";
import { useStore } from "zustand";
import ModalCreateSelectionSpotHashtagsInput from "./ModalCreateSelectionSpotHashtagsInput";


const ModalCreateSelectionSpotHashtags = () => {
  const { 
    hashtags,
    deleteHashtag, 
  } = useStore(useSelectionSpotCreateStore);

  const handleDeleteHashtagClick = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const tag = e.currentTarget.parentElement?.textContent;
    if (tag) {
      deleteHashtag(tag);
    }
  }

  return (
    <div>
      <p className='mt-8 font-bold text-medium mb-4'>태그 등록</p>
      <div className="flex flex-col gap-4 w-full items-stretch">
        <ModalCreateSelectionSpotHashtagsInput />
        <div className="text-small">
          <p className="text-grey4">해시태그는 총 8개까지 등록 가능합니다</p>
          <div className="flex gap-2 mt-4 text-grey3 overflow-x-auto flex-wrap">
          {hashtags.map((tag, index) => (
            <li key={index} className="list-none">
              <Hashtag 
                size="big" 
                name={tag} 
                cancelHashtag={handleDeleteHashtagClick} 
              />
            </li>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
};

export default ModalCreateSelectionSpotHashtags;