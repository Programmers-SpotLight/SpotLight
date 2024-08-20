import { fetchAutoCompletionRecommendTag } from "@/http/selectionSearch.api";
import { useQuery } from "@tanstack/react-query";

const useFetchRecommendAutoCompletion = () => {

  return useQuery({
    queryKey: ["ACrecommendTag"],
    queryFn: () => fetchAutoCompletionRecommendTag(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export default useFetchRecommendAutoCompletion;
