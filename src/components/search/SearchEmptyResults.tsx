import React from 'react'

const SearchEmptyResults = () => {
  return (
    <div className='w-full h-[600px] flex flex-col justify-center items-center gap-[10px]'>
        <h1 className='text-grey3 text-large font-semibold'>검색된 셀렉션이 없어요</h1>
        <h2 className='text-grey3 text-medium'>다른 태그로 검색해보는거 어떠세요?</h2>
    </div>
  )
}

export default SearchEmptyResults