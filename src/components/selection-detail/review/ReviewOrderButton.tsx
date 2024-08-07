import { useState } from "react";

const ReviewOrderButton = () => {
  const [selectedOrder, setSelectedOrder] = useState("추천순");

  let buttonStyles = "w-[75px] h-[28px] rounded-[20px] border border-solid border-grey4 text-small";

  const getButtonStyles = (order: string) => {
    return `${buttonStyles} ${selectedOrder === order ? "bg-grey4 text-white" : "bg-white text-grey4"}`;
  };

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        className={getButtonStyles("추천순")}
        onClick={() => setSelectedOrder("추천순")}
      >
        추천순
      </button>
      <button
        type="button"
        className={getButtonStyles("최신순")}
        onClick={() => setSelectedOrder("최신순")}
      >
        최신순
      </button>
    </div>
  );
};

export default ReviewOrderButton;