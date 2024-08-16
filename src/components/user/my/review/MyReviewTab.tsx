import React, { useState } from 'react'

const reviewTabData: Array<{ title: string; query: ReviewType }> = [
  {
    title: "셀렉션 리뷰",
    query: "selection"
  },
  {
    title: "스팟 리뷰",
    query: "spot"
  }
];

interface ITab {
  reviewType: ReviewType;
  handleTabData: (reviewType: ReviewType) => void
}

const MyReviewTab = ({ reviewType, handleTabData }: ITab) => {
  return (
    <div>
      <ul className="list-none flex gap-[20px] text-large font-bold text-grey3 cursor-pointer mb-10">
        {reviewTabData.map((tabData, index) => (
          <li
            key={index}
            className={
              reviewType === tabData.query
                ? "text-black font-extrabold"
                : "text-grey3"
            }
            onClick={() => handleTabData(tabData.query)}
          >
            {tabData.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MyReviewTab;