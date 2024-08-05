export interface ISelectionCategory {
  id: number;
  name: string;
}

export interface ISelectionLocation {
  id: number;
  name: string;
  options: Array<{
    id: number;
    name: string;
  }>;
}

export interface ISelectionSpotSearchResult {
  name: string;
  id: string;
  formattedAddress: string;
  displayName: {
    text: string;
    languageCode: string;
  };
}

export interface ISelectionSpotGeolocation {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

export interface ISelectionSpotReverseGeolocation {
  formatted_address: string;
  place_id: string;
}

export interface ISelectionSpot {
  placeId: string;
  name: string;
  description: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  hashtags: string[];
  photos: Array<File | string>;
}

export interface ISelectionCreateFormData {
  temp?: boolean;
  category?: number;
  location?: { location: number, subLocation: number };
  name: string;
  description?: string;
  spots?: ISelectionSpot[];
  hashtags?: string[];
}
