import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSelectionDetailInfo } from "../../http/selectionDetail.api";
import { ISelectionInfo } from "@/models/selection.model";

const useSelectionDetail = (
  selectionId: number
): UseQueryResult<ISelectionInfo> => {
  return useQuery({
    queryKey: ["selection", selectionId],
    queryFn: () => fetchSelectionDetailInfo(selectionId),
    staleTime: Infinity
  });
};

export default useSelectionDetail;
