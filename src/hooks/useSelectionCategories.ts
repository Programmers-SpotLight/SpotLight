import { ISelectionCategory } from "@/models/selection.model";
import { useEffect, useState } from "react";
import { fetchSelectionCategories } from "./queries/selectionCreate.query";


const useSelectionCategories = () => {
  const [selectedCategories, setSelectedCategories] = useState<ISelectionCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories : () => Promise<void> = async () => {
    setIsLoading(true);
    try {
      const categories = await fetchSelectionCategories();
      setSelectedCategories(categories);
    } catch (error: any) {
      setError(error.message);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  return { 
    selectedCategories, 
    isLoading, 
    error,
    retryFetchCategories: fetchCategories
  };
};

export default useSelectionCategories;