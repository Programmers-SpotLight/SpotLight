export type SpotCategory = "관광지" | "맛집" | "쇼핑" | "카페" | "기타";

// export interface ISpotInfoForMarking {
//   title: string;
//   categoryName: SpotCategory;
//   id: string;
//   lat: number;
//   lng: number;
// }

export interface ISpotDetail {
  id: number;
  title: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
  gmapId: number;
  category: {
    id: number;
    name: SpotCategory;
  };
  hashtags: string[];
  images: string[];
}
