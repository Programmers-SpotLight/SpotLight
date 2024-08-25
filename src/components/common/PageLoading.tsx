import React from 'react'

const PageLoading = () => {
  return (
<div className='w-screen h-[calc(100vh-74px-118px)] flex justify-center items-center gap-[5px] flex-col'>
    <div className='spinner'/>
    <h1 className='text-large text-primary font-bold mt-5'>Spotlight</h1>
    <h2 className="text-gray-400 text-small font-medium">Spotlight를 통해 일상 속 특별함을 더하세요</h2>
</div>
  )
}

export default PageLoading