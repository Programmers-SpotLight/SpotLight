import { FaUserFriends } from "react-icons/fa";

interface IReviewCountProp {
  count: number;
}

const ReviewCount = ({ count }: IReviewCountProp) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="text-small">리뷰 수</div>
      <div className="flex items-center space-x-1 text-grey4 text-large font-bold">
        <div><FaUserFriends /></div>
        <div>{count}</div>
      </div>
    </div>
  );
};

export default ReviewCount;