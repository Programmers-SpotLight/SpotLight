export type SpotCategory = "관광지" | "맛집" | "쇼핑" | "카페" | "기타";

export interface ISpotInfoForMarking {
  title: string;
  categoryName: SpotCategory;
  id: string;
  lat: number;
  lng: number;
}

export interface ISpotDetail {
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  address: string;
  hashtags: string[];
  images: string[];
}
