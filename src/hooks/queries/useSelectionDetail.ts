import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSelectionDetailInfo } from "../../http/selectionDetail.api";
import { ISelectionInfo } from "@/models/selection.model";
import { QUERY_KEY } from "@/constants/queryKey.constants";

const useSelectionDetail = (
  selectionId: number
): UseQueryResult<ISelectionInfo> => {
  return useQuery({
    queryKey: [QUERY_KEY.SELECTION, selectionId],
    queryFn: () => fetchSelectionDetailInfo(selectionId),
    staleTime: 300000
  });
};

export default useSelectionDetail;
