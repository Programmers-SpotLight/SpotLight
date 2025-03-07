import SelectionCreateHashtagsSuggestionListItem from "./SelectionCreateHashtagsSuggestionListItem";
import useHashtagSuggestion from "@/hooks/useHashtagSuggestion";
import SelectionCreateHashtagsSuggestionListSpinner from "./SelectionCreateHashtagsSuggestionListSpinner";
import { useStore } from "zustand";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import Button from "../common/button/Button";


const SelectionCreateHashtagsSuggestionList = () => {
  const {
    title
  } = useStore(useSelectionCreateStore);

  const {
    hashtags,
    isLoading,
    success,
    suggestHashtags,
    deleteHashtag
  } = useHashtagSuggestion();

  const handleSuggestHashtagsClick = () => {
    suggestHashtags(title);
  };

  /* 사용자가 추천 받은 해시태그를 모두 선택한 경우, 추천 받기 버튼을 렌더링하지 않는다. */
  if (success && !isLoading && hashtags.length === 0) {
    return null;
  }

  return (
    <div className="text-small">
      <p className="text-grey4">이런 태그는 어떠세요?</p>
      { /* isLoading이 true일 때만 로딩 스피너를 렌더링 */ }
      { isLoading && ( 
        <button 
          className="text-small text-white mt-3 p-3 "
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
        >
          <SelectionCreateHashtagsSuggestionListSpinner />
        </button>
      )}

      { /* success가 true일 때만 해시태그 리스트를 렌더링 */ }
      { (success) && 
        <div className="flex gap-2 mt-4 text-[#02588E] overflow-x-auto flex-wrap">
          {hashtags.map((hashtag, index) => (
            <SelectionCreateHashtagsSuggestionListItem
              key={index}
              hashtag={hashtag}
              deleteHashtag={deleteHashtag}
            />
          ))}
        </div>
      } 

      { /* success가 false이고 isLoading이 false일 때만 추천 받기 버튼을 렌더링 */ }
      { (!success && !isLoading) && (
        <div className="mt-3">
          <Button
            color="primary"
            size="large"
            onClick={handleSuggestHashtagsClick}
          >
            해시태그 추천 받기
          </Button>
        </div>
        )
      }
    </div>
  );
};

export default SelectionCreateHashtagsSuggestionList;