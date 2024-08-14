import { QUERY_STRING_NAME } from "@/constants/queryString.constants";
import { TuserSelection } from "@/models/user.model";
import { requestHandler } from "./http";

export const getUserInfo = async (userId: string) => {
    const url = `/api/users/${userId}/`;
    return await requestHandler("get", url);
};

export const fetchUserSelectionList = async (
  userId: string | string[],
  userSelectionType?: TuserSelection,
  sort?: string,
  page?: string,
  limit?: string
) => {
  const url = `api/users/${userId}/selections`;
  const params = new URLSearchParams();
  if (userSelectionType)
    params.append(QUERY_STRING_NAME.userSelection, userSelectionType);
  if (sort) params.append(QUERY_STRING_NAME.sort, sort);
  if (page) params.append(QUERY_STRING_NAME.page, page);
  if (limit) params.append(QUERY_STRING_NAME.limit, limit);

  const finalUrl = `${url}?${params.toString()}`;
  return await requestHandler("get", finalUrl);
};
