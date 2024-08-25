import React from 'react'

const PageError = () => {
  return (
<div className='w-screen h-[calc(100vh-74px-118px)] flex justify-center items-center gap-[5px] flex-col'>
    <div className='spinner'/>
    <h1 className='text-large text-primary font-bold mt-5'>잠시 후 다시 확인해주세요!</h1>
    <h2 className="text-gray-400 text-small font-medium">지금 이 서비스와 연결할 수 없습니다.
      <br/> 문제를 해결하기 위해 노력하고 있습니다.
    </h2>
</div>  )
}

export default PageError