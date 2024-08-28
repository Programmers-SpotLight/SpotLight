import { useState } from "react";
import { fetchReverseGeocodingData } from "@/http/selectionCreate.api";
import { toast } from "react-toastify";


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
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("주소를 가져오는데 실패했습니다");
      }
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