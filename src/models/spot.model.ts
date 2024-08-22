import { Knex } from "knex";
import { Ihashtags } from "./hashtag.model";

export type SpotCategory = "관광지" | "맛집" | "쇼핑" | "카페" | "기타";

export interface ISpotImage {
  url: string;
  order: number;
}

export interface ISpotInfo {
  id: Buffer;
  title: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
  gmapId: string;
  images: ISpotImage[];
  hashtags: Ihashtags[];
  categoryId: number;
  categoryName: SpotCategory;
  order: number;
}

export interface IInsertSpot {
  spot_id: Knex.Raw<any>;
  slt_id: number;
  spot_order: number;
  spot_title: string;
  spot_description: string;
  spot_category_id: number;
  spot_gmap_id: string;
  spot_gmap_address: string;
  spot_gmap_latitude: number;
  spot_gmap_longitude: number;
};

export interface IInsertSpotTemporary {
  spot_temp_id: Knex.Raw<any>;
  slt_temp_id: number;
  spot_temp_order: number;
  spot_category_id: number;
  spot_temp_title: string;
  spot_temp_description: string;
  spot_temp_gmap_id: string;
  spot_temp_gmap_address: string;
  spot_temp_gmap_latitude: number;
  spot_temp_gmap_longitude: number;
}

export interface IInsertSpotImage {
  spot_img_id: Buffer;
  spot_id: Knex.Raw<any>;
  spot_img_url: string;
  spot_img_order: number;
}

export interface IInsertSpotTemporaryImage {
  spot_temp_img_id: Buffer;
  spot_temp_id: Knex.Raw<any>;
  spot_temp_img_url: string;
  spot_temp_img_order: number;
}

export interface ISelectSpot {
  id: string;
  selectionId: string;
  order: number;
  title: string;
  description: string;
  categoryId: number;
  gmapId: string;
  gmapAddress: string;
  gmapLatitude: number;
  gmapLongitude: number;
  hashtags: string[];
  images: string[];
}

export interface ISelectSpotImage {
  spotId: string;
  imageUrl: string;
}