import React from "react";

export const Spinner = () => {
  return <div className="spinner"></div>;
};

interface SearchLoadingProps {
  height: "full" | "search" | "medium" | "small"; 
  loadingMessage?: string;
  additionalClass?: string;
}

export const SearchLoading = ({ height, loadingMessage = "검색 중입니다", additionalClass = "" }: SearchLoadingProps) => {
  let heightClass;

  switch (height) {
    case "full":
      heightClass = "h-full";
      break;
    case "search":
      heightClass = "h-[600px]";
      break;
    case "medium":
      heightClass = "h-[350px]";
      break;
    default:
      heightClass = "h-[full]";
  }

  return (
    <div className={`w-full ${heightClass} flex flex-col justify-center items-center gap-[10px] ${additionalClass}`}>
      <Spinner />
      <h1 className="text-gray-400 text-lg font-semibold">{loadingMessage}</h1>
    </div>
  );
};

export default SearchLoading;
