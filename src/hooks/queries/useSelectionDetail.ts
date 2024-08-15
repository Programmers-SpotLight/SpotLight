import { useQuery } from "@tanstack/react-query";
import { fetchSelectionDetailInfo } from "../../http/selectionDetail.api";

export const useSelectionDetail = (selectionId: number) => {
  const {
    data: selectionData,
    isPending,
    isError
  } = useQuery({
    queryKey: ["selection", selectionId],
    queryFn: () => fetchSelectionDetailInfo(selectionId),
    staleTime: Infinity
  });

  return { selectionData, isPending, isError };
};
