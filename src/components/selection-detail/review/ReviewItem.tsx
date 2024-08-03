import { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import ReviewImages from "./ReviewImages";

interface IReview {
  
}

const ReviewItem = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const text = `컬렉션 엄청 깔끔합니다! 일본 여행 혼자와서 엄청 심심했는데 덕분에 1박2일 아주 재밌게 보냈습니다. 기억도 새록새록 나네요. 특히 정대만이 강백호와 싸웠던 그 장면을 생각하니까 가슴이 웅장해집니다.

  마지막 날 아침, 호텔에서 짐을 챙기며 당신은 어제 봤던 스페셜 컬렉션의 장면들이 머릿속을 스쳐갔습니다. 슬램덩크의 열혈 팬으로서 다시금 떠오르는 장면들은 당신의 마음을 뜨겁게 달궜습니다.

  호텔을 나와서 도시를 거닐던 당신은 현지의 카페에서 아침을 먹으며 생각에 잠겼습니다. 커피 한 잔을 홀짝이며 창밖을 바라보던 당신은 문득, 정대만과 강백호의 대결 이후에 서로를 더 깊이 이해하게 되는 그 장면이 떠올랐습니다
  .
  이윽고, 당신은 책방에서 슬램덩크의 원작 만화를 한 권 사서 휴대폰 번역 앱을 이용해 읽기 시작했습니다. 익숙한 장면들이 일본어로 펼쳐지는 것을 보며, 새로운 느낌과 함께 원작의 매력을 다시금 느낄 수 있었습니다.`;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (isExpanded) {
      return text;
    }
    return text.length > 90 ? text.slice(0, 90) + "..." : text;
  };

  return (
    <div className="block p-5 space-y-3 items-center justify-center">
      <div className="flex space-x-40 items-center justify-center">
        {/* <div className='overflow-hidden shrink-0 mr-2 w-10 h-10 rounded-full'>
          <img className="w-fll h-full object-cover"></img>
        </div> */}
        <div className="flex items-center">
          <div className='w-[38px] h-[38px] bg-grey1 rounded-full flex items-center justify-center'>
            <IoPersonSharp size={25} className="text-primary" />
          </div>
          <div className="space-y-1 text-small w-[80px] ml-2">
            <div>닉네임</div>
            <div className="text-grey3">2024-07-30</div>
          </div>
        </div>
        <div className="flex items-center text-primary space-x-1 text-bold left-0">
          <AiFillLike size={15} />
          <div className="text-small">14</div>
        </div>
      </div>
      {
        <FaStar className="text-yellow-400 text-medium" />
      }
      <ReviewImages />
      
      <div className="text-grey4 text-small">
        {renderText()}
        {text.length > 90 && (
          <button
            onClick={toggleExpand}
          >
            {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default ReviewItem;