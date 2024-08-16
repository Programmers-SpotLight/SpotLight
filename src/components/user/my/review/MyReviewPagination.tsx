import React from 'react';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi'; 

interface IPaginationProps {
  pagination: {
    currentPage: number;
    totalCount: number;
    limit: number;
  }
  onPageChange: (page: number) => void;
}

const PAGE_GROUP_NUM = 5; // 페이지 그룹 수 정의

const MyReviewPagination = ({ pagination, onPageChange }: IPaginationProps) => {
  const { currentPage = 1, totalCount = 0, limit = 10 } = pagination;
  const totalPages = Math.ceil(totalCount / limit); 
  const currentPageGroup = Math.ceil(currentPage / PAGE_GROUP_NUM);;

  const handleClickPage = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page); // 페이지 변경 핸들러 호출
    }
  };

  const pageButtonRender = (totalPages: number) => {
    const startPage = (currentPageGroup - 1) * PAGE_GROUP_NUM + 1;
    const endPage = Math.min(startPage + PAGE_GROUP_NUM - 1, totalPages);
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
    if (currentPage < totalPages) {
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
        {pageButtonRender(totalPages)}
      </ul>
      <button
        className="controllButton p-4 text-grey4 text-extraLarge font-extrabold4 cursor-pointer"
        onClick={nextPage}
        disabled={currentPage >= totalPages}
      >
        <PiCaretRight />
      </button>
    </div>
  );
}

export default MyReviewPagination;
