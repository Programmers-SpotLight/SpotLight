import { useState } from "react";
import { fetchGeocodingData as fetchGeo } from "@/http/selectionCreate.api";
import { toast } from "react-toastify";


const useGeocoding = () => {
  const [coordinates, setCoordinates] = useState<google.maps.LatLngLiteral | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGeocodingData = async (placeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGeo(placeId);
      setCoordinates({
        lat: data.latitude,
        lng: data.longitude
      });
      setAddress(data.formatted_address);
    } catch (error : any) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("해당 위치의 정보를 가져오는데 실패했습니다");
      }
      setError(error);
    }
    setLoading(false);
  }

  return { 
    coordinates, 
    address, 
    fetchGeocodingData,
    loading, 
    error 
  };
};

export default useGeocoding;