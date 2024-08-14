import { useQuery } from "@tanstack/react-query";
import { fetchReviewsInfo } from "@/http/review.api";

interface IReviewProps {
  reviewType: "selection" | "spot";
  sltOrSpotId: number | string;
}

const useReviewInfo = ({ reviewType, sltOrSpotId }: IReviewProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['reviewInfo', reviewType, sltOrSpotId],
    queryFn: () => fetchReviewsInfo({ reviewType, sltOrSpotId }),
  });

  return {
    avg: data?.reviewAvg || 0,
    count: data?.reviewCount || 0,
    loading: isLoading,
    error: isError ? (error as Error).message : null
  };
};

export default useReviewInfo;
