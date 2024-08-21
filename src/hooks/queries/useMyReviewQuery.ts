import { useQuery } from "@tanstack/react-query";
import { fetchMyReview } from "@/http/review.api";

interface IMyReviewProps {
  reviewType: ReviewType;
  page: string;
}

const useMyReviewQuery = ({ reviewType, page }: IMyReviewProps) => {
  const { data, error, isLoading } = useQuery<IMyReviews>({
    queryKey: ['myReview', reviewType, page],
    queryFn: () => fetchMyReview(reviewType, page)
  });

  return { data, isLoading, error };
};

export default useMyReviewQuery;
