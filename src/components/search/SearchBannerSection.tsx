import React from 'react'
import Banner from '../common/Banner'
import BannerButton from '../common/button/BannerButton'

const AddBannerData = {
    img : "/imgs/addBanner-Primary.png",
    title :  "셀렉션을 만들어 스포트라이트에 자랑하세요",
    subTitle :"더 알려져야하는 내 최애의 스팟들!",
    notOpacity : true,
    button : <BannerButton>지금 셀렉션 만들기</BannerButton>
}

const SearchBannerSection = () => {
  return (
    <div>
        <Banner {...AddBannerData}/>
    </div>
  )
}

export default SearchBannerSection