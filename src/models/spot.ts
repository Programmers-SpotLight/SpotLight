export type SpotCategory = "관광지" | "맛집" | "쇼핑" | "카페" | "기타";

export interface ISpotImage {
  url: string;
  order: number;
}

export interface ISpotInfo {
  id: string;
  title: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
  gmapId: string;
  images: ISpotImage[];
  hashtags: string[];
  categoryId: number;
  categoryName: SpotCategory;
}
