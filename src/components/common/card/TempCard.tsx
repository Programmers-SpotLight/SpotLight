import { formatDate } from "@/utils/formatDate";
import React from "react";
import { FaTrash } from "react-icons/fa";

interface ITempCard {
  title: string;
  category?: string;
  region?: string;
  description?: string;
  selectionId?: number;
  created_at: string;
}

const TempCard = ({
  title,
  category,
  region,
  description,
  selectionId,
  created_at
}: ITempCard) => {
  return (
    <div className="flex gap-5 cursor-pointer">
      <div className="flex-[0.8] h-[110px] p-5 bg-white border border-solid border-grey2 rounded-lg flex flex-col gap-[5px]">
        <div className="flex justify-between">
          <h1 className="w-[400px] font-bold text-medium text-black overflow-hidden overflow-ellipsis line-clamp-1 h-[16px]">
            {title}
          </h1>
          <h4 className="font-light text-extraSmall text-grey3">
            {formatDate(created_at)}
          </h4>
        </div>
        <div className="flex gap-[5px]">
          <h3 className="text-extraSmall font-semibold text-grey3">
            {category ? category : "카테고리 미정"}
          </h3>
          <h3 className="text-extraSmall font-semibold text-grey3">
            {region ? region : "지역 미정"}
          </h3>
        </div>
        <div className="text-extraSmall font-medium text-grey4 h-[24px] line-clamp-2 mt-[5px]">
          {description ? description : "설명 미정"}
        </div>
      </div>
      <div className="flex-[0.2] flex items-center justify-center flex-col gap-[5px] text-red-500 cursor-pointer">
        <FaTrash />
        <h1>삭제하기</h1>
      </div>
    </div>
  );
};

export default TempCard;
