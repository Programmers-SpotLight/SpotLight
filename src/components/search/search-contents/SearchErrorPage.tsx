import React from 'react'

interface SearchErrorPageProps {
    message : string
}

const SearchErrorPage = ({message} : SearchErrorPageProps) => {
  return (
    <div className='w-full h-[600px] flex flex-col justify-center items-center gap-[10px]'>
        <h1 className='text-grey3 text-large font-semibold'>잘못된 접근입니다</h1>
        <h2 className='text-grey3 text-medium'>{message}</h2>
    </div>  )
}

export default SearchErrorPage