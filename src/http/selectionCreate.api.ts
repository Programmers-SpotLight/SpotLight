import { requestHandler } from "@/http/http";
import { 
  ISelectionCategory, 
  ISelectionLocation, 
  ISelectionSpotCategory, 
  ISelectionSpotGeolocation, 
  ISelectionSpotReverseGeolocation, 
  ISelectionSpotSearchResult 
} from "@/models/selection.model";


export const fetchSelectionCategories : () => Promise<ISelectionCategory[]> = async () => {
  const response = await requestHandler('get', '/api/selections/categories');
  return response;
};

export const fetchSelectionLocations : () => Promise<ISelectionLocation[]> = async () => {
  const response = await requestHandler('get', '/api/selections/locations');
  return response;
};

export const fetchSelectionSpotSearch : (query: string) => Promise<ISelectionSpotSearchResult[]> = async (query) => {
  const response = await requestHandler('get', `/api/selections/spots/search?query=${query}`);
  return response;
};

export const fetchSelectionSpotCategories : () => Promise<ISelectionSpotCategory[]> = async () => {
  const response = await requestHandler('get', '/api/selections/spots/categories');
  return response;
};

export const fetchReverseGeocodingData : (latitude: number, longitude: number) => Promise<ISelectionSpotReverseGeolocation> = async (latitude, longitude) => {
  const response = await requestHandler(
    'get', 
    `/api/selections/spots/reverse-geolocate?latitude=${latitude}&longitude=${longitude}`
  );
  return response;
};

export const fetchGeocodingData : (googleMapsPlaceId: string) => Promise<ISelectionSpotGeolocation> = async (googleMapsPlaceId) => {
  const response = await requestHandler('get', `/api/selections/spots/geolocate?gmap-id=${googleMapsPlaceId}`);
  return response;
};

export const submitSelection : (selectionData: FormData) => Promise<any> = async (selectionData) => {
  const response = await requestHandler<FormData>(
    'post', 
    '/api/selections', 
    selectionData, 
    {headers: {'Content-Type': 'multipart/form-data'}}
  );
  return response;
}