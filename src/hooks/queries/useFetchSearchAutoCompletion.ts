import { useQuery } from "@tanstack/react-query";
import useDebounce from "../useDeboune";
import { fetchSearchAutocompletion } from "@/http/selectionSearch.api";

const useFetchSearchAutoCompletion = (tagValue: string | null) => {
const debouncedSearch = useDebounce(tagValue, 300);

  return useQuery({
    queryKey: ["searchAuto", debouncedSearch],
    queryFn: async () => {
      if (!tagValue) return [];
      const result = await fetchSearchAutocompletion(tagValue);
      return result || [];
    },
    enabled: !!tagValue,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: {data : []},
  });
};

export default useFetchSearchAutoCompletion;
