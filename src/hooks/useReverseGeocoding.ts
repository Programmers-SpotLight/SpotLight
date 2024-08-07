import { useState } from "react";
import { fetchReverseGeocodingData } from "./queries/selectionCreate.query";


const useReverseGeocoding = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAddress = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReverseGeocodingData(latitude, longitude);
      setAddress(data.formatted_address);
      setPlaceId(data.place_id);
    } catch (error : any) {
      setError(error);
    }
    setLoading(false);
  };

  return { 
    address, 
    placeId,
    fetchAddress,
    loading, 
    error 
  };
};

export default useReverseGeocoding;