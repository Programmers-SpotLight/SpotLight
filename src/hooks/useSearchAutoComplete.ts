import React, { useRef, useState } from "react";

const useSearchAutoComplete = () => {
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagACRef = useRef<HTMLDivElement>(null);
  const [visibleAutoCompletion, setVisibleAutoCompletion] =
    useState<boolean>(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && visibleAutoCompletion && tagACRef.current) {
      e.preventDefault();
      tagACRef.current.focus();
    }
  };

    return {tagInputRef, tagACRef, handleKeyDown, visibleAutoCompletion, setVisibleAutoCompletion};
}

export default useSearchAutoComplete;
