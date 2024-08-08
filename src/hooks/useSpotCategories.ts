import { ISelectionSpotCategory } from "@/models/selection.model";
import { useEffect, useState } from "react";
import { fetchSelectionSpotCategories } from "./queries/selectionCreate.query";


const useSpotCategories = () => {
  const [spotCategories, setSpotCategories] = useState<ISelectionSpotCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories : () => Promise<void> = async () => {
    setIsLoading(true);
    try {
      const categories = await fetchSelectionSpotCategories();
      setSpotCategories(categories);
    } catch (error: any) {
      setError(error.message);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  return { 
    spotCategories, 
    isLoading, 
    error,
    retryFetchCategories: fetchCategories
  };
};

export default useSpotCategories;