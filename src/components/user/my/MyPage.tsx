import React from 'react'
import UserInfo from '../UserInfo';
import { IMinimumUserInfo } from '@/models/user.model';
import { ISelectionDetailInfo } from '@/models/selection.model';
import UserInfoWidget from './UserInfoWidget';
import UserSelectionList from './UserSelectionList';

const user: IMinimumUserInfo = {
    id: 1,
    nickname: "김원길",
    image: "/images/selections/샌과치히로.jpg",
    description:
      "반갑습니다! 저는 김원길입니다. 책, 애니메이션, 영화 관련 셀렉션을 작성하고 수집하고 있습니다. 잘 부탁드립니다.",
    isPrivate: false
  };
  
  const selectionData: ISelectionDetailInfo[] = [
    {
      id: 86,
      title: "샌과 치히로의 행방불명 장소",
      description:
        "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
      status: "public",
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: 1,
      categoryName: "관광지",
      image: "/images/selections/샌과치히로.jpg",
      hashtags: [
        {
          htag_id: 1,
          htag_name: "지브리",
          htag_type: "none"
        }
      ]
    },
    {
      id: 125,
      title: "샌과 치히로의 행방불명 장소",
      description:
        "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
      status: "public",
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: 1,
      categoryName: "관광지",
      image: "/images/selections/샌과치히로.jpg",
      hashtags: [
        {
          htag_id: 1,
          htag_name: "지브리",
          htag_type: "none"
        }
      ]
    },
    {
      id: 120,
      title: "샌과 치히로의 행방불명 장소",
      description:
        "하루키 시리즈 3편! 소설 노르웨이의 숲 배경지 입니다. 무라카미 하루키의 실제 모교였던 무라카미 하루키의 실제 모교였던 와세다..",
      status: "public",
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: 1,
      categoryName: "관광지",
      image: "/images/selections/샌과치히로.jpg",
      hashtags: [
        {
          htag_id: 1,
          htag_name: "지브리",
          htag_type: "none"
        }
      ]
    }
  ];
  

const MyPage = () => {
    const isMyPage = true
  return (
    <div className="border border-solid border-grey2 bg-grey0 w-[1024px] mx-auto min-h-[calc(100vh-74px)] flex justify-center">
          <div className="mt-20 flex flex-col items-center">
            <UserInfo
              nickname={user.nickname}
              description={user.description}
              isMyPage={isMyPage}/>
            <UserInfoWidget/>
            <UserSelectionList/>
            </div>
    </div>
  );
}

export default MyPage