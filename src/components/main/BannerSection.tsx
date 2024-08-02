import React from 'react'
import Banner from '../common/Banner'

const BannerSection = () => {
  return ( // Todo : Slider 구현
    <div className='w-max h-[285px] rounded-lg'>
      <Banner
      img="/imgs/mainBanner-theater.png"
      title="영화 배경 셀렉션 추천"
      subTitle="스크린에서만 보던 그 장소가 내 눈앞에!"
      />
    </div>
  )
}

export default BannerSection