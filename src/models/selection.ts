import { ISpotInfo } from "./spot";

export interface ISelectionDetailInfo {
  id: number;
  title: string;
  description: string;
  status: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
  };
  image?: string;
}

export interface ISelectionInfo extends ISelectionDetailInfo {
  user: {
    id: number;
    nickname: string;
    image?: string;
  };
  location: {
    is_world: boolean;
    region: string;
  };
  hashtags: string[];
  spotList: ISpotInfo[];
  booked: boolean;
}
