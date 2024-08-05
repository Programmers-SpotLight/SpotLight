import { SpotCategory } from "./spot";

export interface ISelectionDetail {
  // 임시 작성 타입 입니다. 수정하시면 될 것 같습니다.
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    nickname: string;
    image?: string;
  };
  location: {
    is_world: boolean;
    region: string;
  };
  image?: string;
  hashtag: string[];
  created_date?: Date;
  status: string | null;
  spot_list: ISpotInfoForMarking[];
}

export interface ISpotInfoForMarking {
  title: string;
  categoryName: SpotCategory;
  id: string;
  lat: number;
  lng: number;
}
