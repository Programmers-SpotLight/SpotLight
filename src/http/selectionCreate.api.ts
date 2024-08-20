import { requestHandler } from "@/http/http";
import { 
  ISelectionSpotGeolocation, 
  ISelectionSpotReverseGeolocation, 
  ISelectionSpotSearchResult 
} from "@/models/selection.model";

export const fetchSelectionSpotSearch : (query: string) => Promise<ISelectionSpotSearchResult[]> = async (query) => {
  const response = await requestHandler('get', `/api/selections/spots/search?query=${query}`);
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

export const fetchHashtagSuggestions : (formData: FormData) => Promise<string[]> = async (formData) => {
  const response = await requestHandler(
    'post', 
    '/api/selections/suggest-hashtags', 
    formData,
    {headers: {'Content-Type': 'multipart/form-data'}} 
  );
  return response;
}

export const submitCompleteSelection : (selectionData: FormData) => Promise<any> = async (selectionData) => {
  const response = await requestHandler<FormData>(
    'post', 
    '/api/selections', 
    selectionData, 
    {headers: {'Content-Type': 'multipart/form-data'}}
  );
  return response;
}

export const submitTemporarySelection : (selectionData: FormData) => Promise<any> = async (selectionData) => {
  const response = await requestHandler<FormData>(
    'post', 
    '/api/temporary-selections', 
    selectionData, 
    {headers: {'Content-Type': 'multipart/form-data'}}
  );
  return response;
}

export const fetchDataForSelectionEdit : (selectionId: number) => Promise<any> = async (selectionId) => {
  const response = await requestHandler('get', `/api/selections/${selectionId}`);
  return response;
}