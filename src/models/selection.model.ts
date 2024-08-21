import { Ihashtags } from "./hashtag.model";
import { TselectionStatus } from "./searchResult.model";
import { ISelectSpot, ISpotInfo } from "./spot.model";
import { IUserInfoData } from "./user.model";

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
  images: Array<File | string>;
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

export type TSelectionCreateFormData =
  | ISelectionCreateTemporaryData
  | ISelectionCreateCompleteData;

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
  location: string;
  writerId: number;
}

export interface ISelectionInfo extends ISelectionDetailInfo {
  writer: IUserInfoData;
  spotList: ISpotInfo[];
}

export interface IModalCreateSelectionSpotExtraData {
  spotCategories: { id: number; name: string }[];
  spot?: ISelectionSpot;
  index?: number;
}

export interface ISelectionCreateCompleteData {
  temp_id?: number;
  status: "public" | "private";
  title: string;
  description: string;
  category: number;
  location: { location: number; subLocation: number };
  img: File | string;
  spots: ISelectionSpot[];
  hashtags: Array<string | number>;
}

export interface ISelectionCreateTemporaryData {
  status: "temp";
  title: string;
  description?: string;
  category?: number;
  location?: { location: number; subLocation: number };
  img?: File | string;
  spots?: ISelectionSpot[];
  hashtags?: Array<string | number>;
}

export interface IInsertSelection {
  slt_title: string;
  slt_status: string;
  slt_category_id: number;
  slt_location_option_id: number;
  slt_description: string;
  slt_img: string;
}

export interface IInsertSelectionTemporary {
  slt_temp_title: string;
  slt_category_id: number | null;
  slt_location_option_id: number | null;
  slt_temp_description: string | null;
  slt_temp_img: string | null;
}

export interface ISelectSelection {
  title: string;
  status?: string;
  userId: number;
  categoryId: number;
  categoryName: string;
  locationId: number;
  locationName: string;
  subLocationId: number;
  subLocationName: string;
  description: string;
  image: string;
  hashtags: string[];
  spots: ISelectSpot[];
}
