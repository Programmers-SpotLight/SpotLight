"use client"

import Spinner from "@/components/common/Spinner";
import MyReviewList from "@/components/user/my/review/MyReviewList";
import MyReviewPagination from "@/components/user/my/review/MyReviewPagination";
import MyReviewTab from "@/components/user/my/review/MyReviewTab";
import useMyReview from "@/hooks/queries/useMyReview";
import React, { useEffect, useState } from 'react'

const UserSelectionPage = () => {
  const [currentTab, setCurrentTab] = useState<ReviewType>("selection");
  const [page, setPage] = useState(1);

  const {
    data, 
    isLoading, 
    error, 
    updateReviewMutation, 
    deleteReviewMutation
  } = useMyReview({ reviewType: currentTab, page: page.toString() });


  const handleTabData = (tabData: ReviewType) => {
    setCurrentTab(tabData);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <MyReviewTab reviewType={currentTab} handleTabData={handleTabData} />
      {
        isLoading ? (
          <Spinner size="large" /> 
        ) : error ? (
          <div className="text-center text-xl font-semibold text-red-500">
            Error loading reviews
          </div>
        ) : ( data && data.reviews.length > 0 ? (
          <>
            <MyReviewList 
              reviews={data.reviews} 
              updateReviewMutation={updateReviewMutation} 
              deleteReviewMutation={deleteReviewMutation}
            />
            <MyReviewPagination
              pagination={data.pagination}
              onPageChange={handlePageChange}
            />
          </>
        )
          :
            <div className="text-center text-xl font-semibold text-grey4">
              No reviews found
            </div>
        )
      }
    </div>
  )
}

export default UserSelectionPage