import { Ihashtags } from "./hashtag.model";
import { TselectionStatus } from "./searchResult.model";
import { ISpotInfo } from "./spot.model";

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
  title: string;
  description: string;
  category: number;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  hashtags: Array<number | string>;
  photos: Array<File | string>;
}

export interface ISelectionSpotCategory {
  id: number;
  name: string;
}

export interface ISelectionCreateFormData {
  status: string;
  category?: number;
  location?: { location: number; subLocation: number };
  img?: File | string;
  title: string;
  description?: string;
  spots?: ISelectionSpot[];
  hashtags?: Array<string | number>;
}

export interface ISelectionCategoryQueryResultRow {
  category_id: number;
  category_name: string;
}

export interface ISelectionLocationQueryResultRow {
  location_id: number;
  location_name: string;
  location_option_id: number;
  location_option_name: string;
}

export interface ISelectionDetailInfo {
  id: number;
  title: string;
  description: string;
  status: TselectionStatus;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  categoryName: string;
  image?: string;
  hashtags: Ihashtags[];
}

export interface ISelectionInfo extends ISelectionDetailInfo {
  user: {
    id: number;
    nickname: string;
    image?: string;
  };
  location: string;
  spotList: ISpotInfo[];
  booked: boolean;
}

export interface IModalCreateSelectionSpotExtraData {
  spotCategories: { id: number; name: string }[];
  spot?: ISelectionSpot;
  index?: number;
}
