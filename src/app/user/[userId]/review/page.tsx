"use client"

import { Tab, Tabs } from "@/components/common/Tabs";
import MyReview from "@/components/user/my/review/MyReview";
import React from 'react'

const UserSelectionPage = () => {
  const reviewTabData = () => [
    {
      title: "셀렉션 리뷰",
      component: <MyReview reviewType="selection" />
    },
    {
      title: "스팟 리뷰",
      component: <MyReview reviewType="spot" />
    }
  ];
  return (
    <div>
      <Tabs>
        {reviewTabData().map((tab) => (
          <Tab key={tab.title} title={tab.title}>
            {tab.component}
          </Tab>
        ))}
      </Tabs>
    </div>
  )
}

export default UserSelectionPage