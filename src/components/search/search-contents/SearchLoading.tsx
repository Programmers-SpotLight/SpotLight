import React from "react";

const Spinner = () => {
  return <div className="spinner"></div>;
};

const SearchLoading = () => {
  return (
    <div className='w-full h-[600px] flex flex-col justify-center items-center gap-[10px]'>
      <Spinner />
      <h1 className="text-gray-400 text-lg font-semibold">검색 중입니다</h1>
    </div>
  );
};

export default SearchLoading