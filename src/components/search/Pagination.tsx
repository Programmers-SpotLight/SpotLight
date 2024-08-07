'use client';

import { addQueryString, deleteQueryString } from '@/utils/updateQueryString';
import React from 'react';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi'; 

interface IPaginationProps {
  pagination: {
    currentPage: number;
    limit: number;
    totalElements: number;
    totalPages: number;
  }
}

const PAGE_GROUP_NUM = 5; // 페이지 그룹 수 정의

const Pagination = ({ pagination }: IPaginationProps) => {
  const currentPage = pagination.currentPage || 1;
  const currentPageGroup = Math.ceil(currentPage / PAGE_GROUP_NUM);

  const handleClickPage = (page: number) => {
    deleteQueryString("page");
    deleteQueryString("limit");
    addQueryString("page", page.toString());
    const limitValue = pagination.limit;
    addQueryString("limit", limitValue.toString());
  };

  const pageButtonRender = (totalPages: number) => {
    const startPage = (currentPageGroup - 1) * PAGE_GROUP_NUM + 1;
    const endPage = Math.min(PAGE_GROUP_NUM * currentPageGroup, totalPages);
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i}>
          <div
            className={`flex font-medium text-medium cursor-pointer px-2 py-1 ${i === currentPage ? 'bg-primary text-white rounded-full' : 'hover: rounded-full text-grey4 hover:text-white hover:bg-grey3'}`}
            onClick={() => handleClickPage(i)}
          >
            {i}
          </div>
        </li>
      );
    }
    return pageNumbers;
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handleClickPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < pagination.totalPages) {
      handleClickPage(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10 mb-10">
      <button
        className="controllButton p-4 text-grey4 text-extraLarge font-extrabold4 cursor-pointer"
        onClick={prevPage}
        disabled={currentPage === 1}
      >
        <PiCaretLeft />
      </button>
      <ul className="flex space-x-1 gap-[5px]">
        {pageButtonRender(pagination.totalPages)}
      </ul>
      <button
        className="controllButton p-4 text-grey4 text-extraLarge font-extrabold4 cursor-pointer"
        onClick={nextPage}
        disabled={currentPage >= pagination.totalPages}
      >
        <PiCaretRight />
      </button>
    </div>
  );
}

export default Pagination;
