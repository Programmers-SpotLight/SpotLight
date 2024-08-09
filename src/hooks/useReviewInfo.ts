import { fetchReviewsInfo } from "@/http/review.api";
import { useEffect, useState } from "react";

interface IReviewProps {
  reviewType: "selection" | "spot";
  sltOrSpotId: number;
}

const useReviewInfo = ({ reviewType, sltOrSpotId }: IReviewProps) => {
  const [avg, setAvg] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewsInfoData = async () => {
    try {
      const response = await fetchReviewsInfo({ reviewType, sltOrSpotId });
      if(response) {
        setAvg(response.reviewAvg);
        setCount(response.reviewCount);
      }
    } catch (error) {
      setError("Failed to fetch review info.");
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsInfoData();
  }, []);

  
  return {
    avg,
    count,
    loading,
    error
  };
};

export default useReviewInfo;
