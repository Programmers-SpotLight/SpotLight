import { FaStar } from "react-icons/fa";

const ReviewAvg = () => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="text-small">평균 별점</div>
      <div className="flex items-baseline space-x-1">
        <div className="text-yellow-400 text-large font-bold"><FaStar /></div>
        <div className="text-grey4 text-large font-bold">4.2</div>
        <div className="text-grey3 text-small">/5</div>
      </div>
    </div>
  );
};


export default ReviewAvg;