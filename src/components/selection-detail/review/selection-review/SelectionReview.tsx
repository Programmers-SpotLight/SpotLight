import Button from "../../../common/button/Button";
import ReviewAvg from "../ReviewAvg";
import ReviewCount from "../ReviewCount";
import SelectionReviewList from "./SelectionReviewList";
import ReviewOrderButton from "../ReviewOrderButton";
import { useModalStore } from "@/stores/modalStore";

interface ISelectionReviewsProps {
  selectionId: number;
};

interface ISelectionReviews {
  sltReviewAvg : number;
  sltReviewCount : number;
  sltReviewList : ISelectionReview[];
};

const testList: ISelectionReview[] = [
  {
    sltReviewId: 1,
    sltId: 101,
    sltReviewImg: ["https://www.kagoshima-kankou.com/storage/tourism_themes/12/responsive_images/ElwnvZ2u5uZda7Pjcwlk4mMtr08kLNydT8zXA6Ie__1673_1115.jpeg", "https://res.klook.com/image/upload/q_85/c_fill,w_750/v1617101647/blog/edlhmuf96dpqcnodl9qf.jpg","https://res.klook.com/image/upload/q_85/c_fill,w_750/v1617101647/blog/edlhmuf96dpqcnodl9qf.jpg"],
    stlReviewDescription: `컬렉션 엄청 깔끔합니다! 일본 여행 혼자와서 엄청 심심했는데 덕분에 1박2일 아주 재밌게 보냈습니다. 기억도 새록새록 나네요. 특히 정대만이 강백호와 싸웠던 그 장면을 생각하니까 가슴이 웅장해집니다.

  마지막 날 아침, 호텔에서 짐을 챙기며 당신은 어제 봤던 스페셜 컬렉션의 장면들이 머릿속을 스쳐갔습니다. 슬램덩크의 열혈 팬으로서 다시금 떠오르는 장면들은 당신의 마음을 뜨겁게 달궜습니다.

  호텔을 나와서 도시를 거닐던 당신은 현지의 카페에서 아침을 먹으며 생각에 잠겼습니다. 커피 한 잔을 홀짝이며 창밖을 바라보던 당신은 문득, 정대만과 강백호의 대결 이후에 서로를 더 깊이 이해하게 되는 그 장면이 떠올랐습니다
  .
  이윽고, 당신은 책방에서 슬램덩크의 원작 만화를 한 권 사서 휴대폰 번역 앱을 이용해 읽기 시작했습니다. 익숙한 장면들이 일본어로 펼쳐지는 것을 보며, 새로운 느낌과 함께 원작의 매력을 다시금 느낄 수 있었습니다.`,
    sltReviewScore: 5,
    sltCreatedDate: "2024-01-01",
    sltUpdatedDate: "2024-01-02",
    user: {
      userId: 201,
      userNickname: "User1",
      userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww",
      isLiked: true
    },
    likeCount: 10
  },
  {
    sltReviewId: 2,
    sltId: 101,
    sltReviewImg: ["https://www.kagoshima-kankou.com/storage/tourism_themes/12/responsive_images/ElwnvZ2u5uZda7Pjcwlk4mMtr08kLNydT8zXA6Ie__1673_1115.jpeg", "https://www.kagoshima-kankou.com/storage/tourism_themes/12/responsive_images/ElwnvZ2u5uZda7Pjcwlk4mMtr08kLNydT8zXA6Ie__1673_1115.jpeg"],
    stlReviewDescription: "Not bad, but could be better.Not bad, but could be better.Not bad, but could be better.Not bad, but could be better.",
    sltReviewScore: 3,
    sltCreatedDate: "2024-01-03",
    sltUpdatedDate: "2024-01-04",
    user: {
      userId: 202,
      userNickname: "User2",
      userImage: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
      isLiked: false
    },
    likeCount: 5
  },
  {
    sltReviewId: 3,
    sltId: 101,
    sltReviewImg: ["https://www.kagoshima-kankou.com/storage/tourism_themes/12/responsive_images/ElwnvZ2u5uZda7Pjcwlk4mMtr08kLNydT8zXA6Ie__1673_1115.jpeg"],
    stlReviewDescription: "이윽고, 당신은 책방에서 슬램덩크의 원작 만화를 한 권 사서 휴대폰 번역 앱을 이용해 읽기 시작했습니다. 익숙한 장면들이 일본어로 펼쳐지는 것을 보며, ",
    sltReviewScore: 1,
    sltCreatedDate: "2024-01-05",
    sltUpdatedDate: "2024-01-06",
    user: {
      userId: 200,
      userNickname: "User44",
      userImage: null,
      isLiked: false
    },
    likeCount: 2
  },
  {
    sltReviewId: 4,
    sltId: 101,
    sltReviewImg: null,
    stlReviewDescription: "Pretty good overall.",
    sltReviewScore: 4,
    sltCreatedDate: "2024-01-07",
    sltUpdatedDate: "2024-01-08",
    user: {
      userId: 203,
      userNickname: "User3",
      userImage: "https://images.unsplash.com/photo-1495837174058-628aafc7d610?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
      isLiked: true
    },
    likeCount: 8
  },
  {
    sltReviewId: 5,
    sltId: 101,
    sltReviewImg: null,
    stlReviewDescription: "Average product, nothing special.",
    sltReviewScore: 3,
    sltCreatedDate: "2024-01-09",
    sltUpdatedDate: "2024-01-10",
    user: {
      userId: 204,
      userNickname: "User4",
      userImage: null,
      isLiked: false
    },
    likeCount: 4
  }
];

const testData: ISelectionReviews = {
  sltReviewAvg: 4.5,
  sltReviewCount: 5,
  sltReviewList: testList
};

const SelectionReview = ({ selectionId } : ISelectionReviewsProps) => {
  const { openModal } = useModalStore();

  const openReviewAddModal = () => {
    openModal('review'); 
  };

  return (
    <div className="relative flex-grow overflow-x-visible space-y-3">

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white border border-solid border-grey2 rounded-lg w-[335px] h-[62px] flex items-center justify-center space-x-16">
          <ReviewAvg avg={testData.sltReviewAvg} />
          <ReviewCount count={testData.sltReviewCount} />
        </div>
      </div>

      <ReviewOrderButton />

      <SelectionReviewList reviews={testData.sltReviewList} />

      <div className="absolute sticky bottom-4 w-full flex justify-center z-10">
        <Button type="button" onClick={openReviewAddModal}>리뷰 등록하기 +</Button>
      </div>
      
    </div>
  );
};

export default SelectionReview;