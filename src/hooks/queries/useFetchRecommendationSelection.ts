import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { QUERY_KEY } from "@/constants/queryKey.constants";
import { getRecommendationSelections } from "@/http/selectionMain.api";
import { IColCardProps } from "@/components/common/card/ColCard";

const useFetchRecommendationSelection = (): UseQueryResult<IColCardProps[]> => {
  return useQuery<IColCardProps[], AxiosError>({
    queryKey: [
      QUERY_KEY.RECOMMEND,
    ],
    queryFn: () =>
        getRecommendationSelections(),
    staleTime: 300000,
    refetchOnWindowFocus : false,
    refetchOnMount : "always",
    refetchOnReconnect : false
  },
);
};

export default useFetchRecommendationSelection;
