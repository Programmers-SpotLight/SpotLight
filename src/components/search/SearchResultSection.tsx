"use client";

import React, { useEffect, useRef, useState } from "react";
import ColCard, { IColCardProps } from "../common/card/ColCard";
import Hashtag from "../common/Hashtag";
import { useSearchParams } from "next/navigation";
import { FaCaretDown } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import useClickOutside from "@/hooks/useClickOutside";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";

const sortData = [
  { name: "최신순", id: 0 },
  { name: "오름차순", id: 1 },
  { name: "인기순", id: 2 }
];

const SearchResultSection = () => {
  const searchParams = useSearchParams();
  const [currentSortOption, setCurrentSortOption] = useState<string>("정렬");
  const [isSortClicked, setIsSortClicked] = useState<boolean>(false);
  const sortRef = useRef<HTMLDivElement>(null);
  useClickOutside(sortRef, setIsSortClicked);

  const toggleSortOptions = () => {
    setIsSortClicked((prevState) => !prevState);
  };

  const handleItemClick = (event: React.MouseEvent, name: string, id: number) => {
    event.stopPropagation();
    setCurrentSortOption(name);
    setIsSortClicked(false);
    deleteQueryString("sort");
    addQueryString("sort", id.toString());
  };

  useEffect(() => {
    if (searchParams) {
      // 쿼리스트링 변경 시 동작되는 함수
      const tags = searchParams.getAll("tags");
      const catgeory = searchParams.get("카테고리") || "0";
      const region = searchParams.get("지역") || "0";

      console.log(tags, catgeory, region);
    }
  }, [searchParams]);

  return (
    <div className="px-5">
      <div
        className="flex justify-end gap-[5px] text-medium text-grey4 mb-5 relative cursor-pointer"
        ref={sortRef}
        onClick={toggleSortOptions}
      >
        <div>{currentSortOption}</div>
        <FaCaretDown className="w-[15px] h-[15px]" />
        {isSortClicked && ( // 정렬 드롭다운 박스
          <div className="absolute translate-x-1 top-full p-[10px] mt-5 bg-white w-[120px] h-[100px] z-10 border-solid border border-grey2 rounded-lg box-border">
            {sortData.map((data, index) => (
              <li
                key={index}
                className="cursor-pointer flex justify-between list-none text-small text-grey4 hover:bg-grey1 p-[6px] rounded-lg"
                onClick={(event) => handleItemClick(event, data.name, data.id)}
              >
                {data.name}
                <MdNavigateNext className="w-[10x] h-[15px] font-bold" />
              </li>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-5">
        {tempData.map((data) => (
          <ColCard key={data.selectionId} {...data} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultSection;

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
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
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
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
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
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
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
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  },
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 5,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 6,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  },
  {
    thumbnail:
      "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_846577_16989928215689644.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 7,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 8,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  },
  {
    thumbnail: "https://img.newspim.com/news/2016/12/22/1612220920255890.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 9,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 10,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  },
  {
    thumbnail:
      "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_846577_16989928215689644.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 11,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  },
  {
    thumbnail: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    title: "조커2 개봉기념 조커 계단 장소",
    category: "영화",
    description:
      "뉴욕을 배경으로 했던 영화 조커에서 나왔던 장소 정리했습니다! 조커2보기전에 한번쯤 보시면 좋을것 같습니다",
    selectionId: 12,
    userName: "이창우",
    userImage: "https://thumb.mt.co.kr/06/2024/04/2024041711227227340_1.jpg",
    isPublic: true,
    hashtags: [
      <Hashtag size="small" name="구름" />,
      <Hashtag size="small" name="슬램덩크" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />,
      <Hashtag size="small" name="선재업고 튀어" />
    ]
  }
];
