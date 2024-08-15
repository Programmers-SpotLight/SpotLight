"use client"

import MyReview from "@/components/user/my/review/MyReview";
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


const UserSelectionPage = () => {
  const [currentTab, setCurrentTab] = useState<ReviewType>("selection");

  const handleTabData = (tabData: ReviewType) => {
    setCurrentTab(tabData);
  };

  return (
    <div>
      <ul className="list-none flex gap-[20px] text-large font-bold text-grey3 cursor-pointer mb-10">
        {reviewTabData.map((tabData, index) => (
          <li
            key={index}
            className={
              currentTab === tabData.query
                ? "text-black font-extrabold"
                : "text-grey3"
            }
            onClick={() => handleTabData(tabData.query)}
          >
            {tabData.title}
          </li>
        ))}
      </ul>
      <MyReview reviewType={currentTab} />
    </div>
  )
}

export default UserSelectionPage