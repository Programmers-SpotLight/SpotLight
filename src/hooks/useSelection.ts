import { useQuery } from "@tanstack/react-query";
import { fetchSelectionDetailInfo } from "./queries/selectionDetail.query";

export const useSelection = (selectionId: string | string[]) => {
  const {
    data: selectionData,
    isPending,
    isError
  } = useQuery({
    queryKey: ["selection", selectionId],
    queryFn: () => fetchSelectionDetailInfo(selectionId)
  });

  return { selectionData, isPending, isError };
};
