import { TuserSelection } from "@/models/user.model";

export const SELECTION_STATUS : Array<string> = [
  'temp', 'public', 'private'
];

export const userSelectiontabDatas: Array<{ title: string; query: TuserSelection }> = [
  {
    title: "작성한 셀렉션",
    query: "my"
  },
  {
    title: "북마크 셀렉션",
    query: "bookmark"
  },
  {
    title: "임시저장 셀렉션",
    query: "temp"
  }
];
