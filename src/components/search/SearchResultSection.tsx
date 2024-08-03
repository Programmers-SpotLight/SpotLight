import React from "react";
import ColCard, { IColCardProps } from "../common/card/ColCard";
import Hashtag from "../common/Hashtag";
const tempData: IColCardProps[] = [
  // 임시 카드 UI 데이터
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 1,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 2,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail:
      "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_846577_16989928215689644.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 3,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 4,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 1,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 2,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail:
      "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_846577_16989928215689644.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 3,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 4,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 1,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 2,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail:
      "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_846577_16989928215689644.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 3,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 4,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름"/>,
      <Hashtag size="small" name="슬램덩크"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
      <Hashtag size="small" name="선재업고 튀어"/>,
    ]
  }
];

const SearchResultSection = () => {
  return (
    <div className="p-5 grid grid-cols-4 gap-5">
      {tempData.map((data) => (
        <ColCard key={data.selectionId} {...data} />
      ))}
    </div>
  );
};

export default SearchResultSection;
