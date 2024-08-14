import { Ihashtags } from "./hashtag.model";

export interface IMinimumUserInfo {
  id: number;
  nickname: string;
  image: string;
  description: string;
  isPrivate: boolean;
}

export interface IUserInfoData {
  user_nickname: string
  user_email: string
  user_img: string
  user_description: string
  user_role: string
  user_is_private: number
  user_type: string
  selection_count: number,
  bookmark_count: number,
  spot_review_count: number,
  selection_review_count: number
}

export interface IUserInfoMapping {
  image : string
  nickname : string
  description : string
  is_private : number
  isMyPage : boolean
  hashtags : Ihashtags[]
  selection_count: number
  bookmark_count: number
  spot_review_count: number
  selection_review_count: number
}

export type TuserSelection = "my" | "bookmark" | "temp"