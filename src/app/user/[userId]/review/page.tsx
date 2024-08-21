"use client";

import SearchLoading from "@/components/search/search-contents/SearchLoading";
import MyReviewList from "@/components/user/my/review/MyReviewList";
import MyReviewPagination from "@/components/user/my/review/MyReviewPagination";
import MyReviewTab from "@/components/user/my/review/MyReviewTab";
import useMyReview from "@/hooks/mutations/useMyReview";
import React, { useState } from 'react'

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
    <div className="flex flex-col justify-center items-center w-full mt-5">
      <div className="h-auto m-auto px-[20px] box-border w-full w-max-[600px]">
        <MyReviewTab reviewType={currentTab} handleTabData={handleTabData} />
        {
          isLoading ? (
            <SearchLoading height='search' loadingMessage="리뷰를 불러오는 중입니다" />
          ) : error ? (
            <div className="h-32 flex items-center justify-center text-center text-xl font-semibold text-red-500">
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
              <div className="h-32 flex items-center justify-center text-center text-xl font-semibold text-grey4">
                등록된 리뷰가 없습니다.
              </div>
          )
        }
      </div>
    </div>
  );
};

export default UserSelectionPage;
