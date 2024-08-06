import { ISpotInfoForMarking } from "./spot";

export interface ISelectionDetail {
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
  hashtags: string[];
  created_date?: Date;
  status: string | null;
  spot_list: ISpotInfoForMarking[];
  booked: boolean;
}
