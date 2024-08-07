import { 
  ISelectionCategory, 
  ISelectionLocation, 
  ISelectionSpotCategory, 
  ISelectionSpotGeolocation, 
  ISelectionSpotReverseGeolocation, 
  ISelectionSpotSearchResult 
} from "@/models/selection.model";
import axios from "axios"


export const fetchSelectionCategories : () => Promise<ISelectionCategory[]> = async () => {
  const response = await axios.get('/api/selections/categories');
    if (response.status !== 200) {
        throw new Error('Failed to fetch selection categories');
    }
  return response.data;
};

export const fetchSelectionLocations : () => Promise<ISelectionLocation[]> = async () => {
  const response = await axios.get('/api/selections/locations');
  if (response.status !== 200) {
    throw new Error('Failed to fetch selection locations');
  }
  return response.data;
};

export const fetchSelectionSpotSearch : (query: string) => Promise<ISelectionSpotSearchResult[]> = async (query) => {
  const response = await axios.get(`/api/selections/spots/search?query=${query}`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch selection spot search');
  }
  return response.data;
};

export const fetchSelectionSpotCategories : () => Promise<ISelectionSpotCategory[]> = async () => {
  const response = await axios.get('/api/selections/spots/categories');
  if (response.status !== 200) {
    throw new Error('Failed to fetch selection spot categories');
  }
  return response.data;
};

export const fetchReverseGeocodingData : (latitude: number, longitude: number) => Promise<ISelectionSpotReverseGeolocation> = async (latitude, longitude) => {
  const response = await axios.get(`/api/selections/spots/reverse-geolocate?latitude=${latitude}&longitude=${longitude}`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch reverse geocoding data');
  }
  return response.data;
};

export const fetchGeocodingData : (googleMapsPlaceId: string) => Promise<ISelectionSpotGeolocation> = async (googleMapsPlaceId) => {
  const response = await axios.get(`/api/selections/spots/geolocate?gmap-id=${googleMapsPlaceId}`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch geocoding data');
  }
  return response.data;
};