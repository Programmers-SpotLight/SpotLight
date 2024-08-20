import React, { useState } from "react";
import useFetchSearchAutoCompletion from "@/hooks/queries/useFetchSearchAutoCompletion";
import useClickOutside from "@/hooks/useClickOutside";
import AutoCompletionList from "./AutoCompletionList";
import AutoCompletionRecommendList from "./AutoCompletionRecommendList";

interface IAutoCompletionProps {
  tagValue: string | null;
  setTagValue: React.Dispatch<React.SetStateAction<string>>;
  setVisibleAutoCompletion: React.Dispatch<React.SetStateAction<boolean>>;
  tagACRef: React.RefObject<HTMLDivElement>;
  tagInputRef: React.RefObject<HTMLInputElement>;
  isRecommend?: boolean 
}

const AutoCompletion: React.FC<IAutoCompletionProps> = ({
  tagValue,
  setTagValue,
  setVisibleAutoCompletion,
  tagACRef,
  tagInputRef,
  isRecommend
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const {
    data: results,
    isError,
    isLoading
  } = useFetchSearchAutoCompletion(tagValue);

  useClickOutside(tagACRef, () => {
    setVisibleAutoCompletion(false);
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, (results?.data.length || 0) - 1)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selectedIndex >= 0 && results?.data) {
        setTagValue(results.data[selectedIndex].htag_name);
        setVisibleAutoCompletion(false);
        if (tagInputRef.current) tagInputRef.current.focus();
      }
    } else {
      if (tagInputRef.current) {
        setTimeout(() => {
          if (tagInputRef.current) tagInputRef.current.focus();
        }, 10);
      }
    }
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();
    setSelectedIndex(index);
    setTagValue(results.data[index].htag_name);
    setVisibleAutoCompletion(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <div className="font-bold" key={index}>
          {part}
        </div>
      ) : (
        part
      )
    );
  };

  if (!results || isLoading) return null;

  return (
    <>
      {results.data.length > 0 && (
        <div
          className="flex absolute z-10 w-full bg-white border border-solid border-grey2 rounded-md mt-1 max-h-[300px] overflow-auto outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          ref={tagACRef}
        >
          <div className="flex w-full">
            <AutoCompletionList
              autoCompletionList={results.data}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              handleMouseDown={handleMouseDown}
              highlightMatch={highlightMatch}
              tagValue={tagValue}
              isRecommend={isRecommend}
            />
            { isRecommend &&
            <div className="flex-0.5 w-2/5">
              <AutoCompletionRecommendList
              setTagValue={setTagValue}
              />
            </div>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default AutoCompletion;
