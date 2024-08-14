import { useState } from "react";

interface IReviewSortProp {
  sort: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { id: "like", value: "추천순" },
  { id: "latest", value: "최신순" },
];

const ReviewSortButton = ({sort, onSortChange }: IReviewSortProp) => {
  let buttonStyles = "w-[75px] h-[28px] rounded-[20px] border border-solid border-grey4 text-small";

  const getButtonStyles = (sorting: string) => {
    return `${buttonStyles} ${sort === sorting ? "bg-grey4 text-white" : "bg-white text-grey4"}`;
  };

  return (
    <div className="flex space-x-2">
      {sortOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={getButtonStyles(option.id)}
          onClick={() => onSortChange(option.id)}
        >
          {option.value}
        </button>
      ))}
    </div>
  );
};

export default ReviewSortButton;