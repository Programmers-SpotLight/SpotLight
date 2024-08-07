import { ISelectionSpotSearchResult } from "@/models/selection.model";
import { useState } from "react";
import { fetchSelectionSpotSearch } from "./queries/selectionCreate.query";


const useSpotSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [spots, setSpots] = useState<ISelectionSpotSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSpots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSelectionSpotSearch(searchValue);
      setSpots(response);
    } catch (error : any) {
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