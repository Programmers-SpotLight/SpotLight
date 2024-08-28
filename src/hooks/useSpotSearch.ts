import { ISelectionSpotSearchResult } from "@/models/selection.model";
import { useState } from "react";
import { fetchSelectionSpotSearch } from "@/http/selectionCreate.api";
import { toast } from "react-toastify";


const useSpotSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [spots, setSpots] = useState<ISelectionSpotSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSpots = async () => {
    setLoading(true);
    setSpots(null);
    setError(null);
    try {
      const response = await fetchSelectionSpotSearch(searchValue);
      setSpots(response);
    } catch (error : any) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("스팟 검색에 실패했습니다");
      }
      setError(error);
    }
    setLoading(false);
  };

  return { 
    searchValue, 
    setSearchValue, 
    spots, 
    fetchSpots,
    loading, 
    error 
  };
}

export default useSpotSearch;