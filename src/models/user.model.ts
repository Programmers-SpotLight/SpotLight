export interface IMinimumUserInfo {
  id: number;
  nickname: string;
  image: string;
  description: string;
  isPrivate: boolean;
}

export type TuserSelection = "my" | "bookmark" | "temp"