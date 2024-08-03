import { FaPlus } from "react-icons/fa";
import Button from "../../../common/button/Button";
import ReviewAvg from "../ReviewAvg";
import ReviewCount from "../ReviewCount";
import SelectionReviewList from "./SelectionReviewList";

const SelectionReview = () => {
  return (
    <div className="relative overflow-y-auto">
      유저 평가
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white border border-solid border-grey2 rounded-lg w-[335px] h-[62px] flex items-center justify-center space-x-16">
          <ReviewAvg />
          <ReviewCount />
        </div>
      </div>

      <SelectionReviewList />

      <div className="fixed bottom-4 w-full flex justify-center">
        <Button type="button">리뷰 등록하기 +</Button>
      </div>
    </div>
  );
};

export default SelectionReview;