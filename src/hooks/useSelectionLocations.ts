import { ISelectionLocation } from "@/models/selection.model";
import { useEffect, useState } from "react";
import { fetchSelectionLocations } from "./queries/selectionCreate.query";


const useSelectionLocations = () => {
  const [selectionLocations, setSelectionLocations] = useState<ISelectionLocation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations : () => Promise<void> = async () => {
    setIsLoading(true);
    try {
      const locations = await fetchSelectionLocations();
      setSelectionLocations(locations);
    } catch (error: any) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    selectionLocations,
    isLoading,
    error,
    retryFetchLocations: fetchLocations
  };
}

export default useSelectionLocations;