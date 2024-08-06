import { ISpotDetail } from "./spot";

export interface ISelectionDetail {
  id: number;
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
  createdAt: Date;
  updatedAt: Date;
  status: string | null;
  spot_list: ISpotDetail[];
  booked: boolean;
}
