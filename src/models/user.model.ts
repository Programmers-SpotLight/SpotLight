export interface IUserInfoData {
  user_nickname: string;
  user_email: string;
  user_img: string;
  user_description: string;
  user_role: string;
  user_is_private: number;
  user_type: string;
  selection_count: number;
  bookmark_count: number;
  spot_review_count: number;
  selection_review_count: number;
}

export interface IUserInfoMapping {
  image: string;
  nickname: string;
  description: string;
  is_private: number;
  isMyPage: boolean;
  selection_count: number;
  bookmark_count: number;
  spot_review_count: number;
  selection_review_count: number;
}

export interface SuccessResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export type TuserSelection = "my" | "bookmark" | "temp";
