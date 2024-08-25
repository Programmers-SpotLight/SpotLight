import { requestHandler } from "@/http/http";
import { useEffect, useState } from "react";


const usePopularSelections = () => {
  const [popularSelections, setPopularSelections] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularSelections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await requestHandler("get", "/api/selections/popular");
      setPopularSelections(data);
    } catch (error: any) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPopularSelections();
  }, []);

  return { 
    popularSelections, 
    isLoading, 
    error,
    retryFetchPopularSelections: fetchPopularSelections
  };
};

export default usePopularSelections;