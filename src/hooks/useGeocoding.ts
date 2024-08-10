import { useState } from "react";
import { fetchGeocodingData as fetchGeo } from "@/http/selectionCreate.api";


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