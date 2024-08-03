import { FaUserFriends } from "react-icons/fa";

const ReviewCount = () => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="text-small">리뷰 수</div>
      <div className="flex items-center space-x-1 text-grey4 text-large font-bold">
        <div><FaUserFriends /></div>
        <div>3</div>
      </div>
    </div>
  );
};

export default ReviewCount;