import React from 'react'
import { MdError } from 'react-icons/md'

const PageError = () => {
  return (
<div className='w-screen h-[calc(100vh-74px-118px)] flex justify-center items-center gap-5 flex-col'>

    <MdError className='text-[50px] text-primary'/>
    <h1 className='text-large text-black font-extrabold'>잠시만 기다려주세요!</h1>
    <h2 className="text-gray-400 text-small font-medium text-center">현재 스포트라이트와 서비스와 연결 할 수 없습니다
      <br/> 문제 해결을 위해 신속하게 대응하고있습니다
      <br/> 불편을 드려 정말 죄송합니다
    </h2>
</div>  )
}

export default PageError