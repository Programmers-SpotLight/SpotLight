import { QUERY_STRING_NAME } from "@/constants/queryString.constants";
import { TuserSelection } from "@/models/user.model";
import { requestHandler } from "./http";
import axios from "axios";

export const getUserInfo = async (userId: string) => {
    const url = `/api/users/${userId}/`;
    return await requestHandler("get", url);
};

export const updateUserDescription = async (userId : string, description : string) => {
  const url = `/api/users/${userId}/description`
  return await requestHandler("put", url, {data : {description, userId}})
}

export const addUserHashTag = async (userId : string, hashtag : string) => {
  const url = `/api/users/${userId}/hashtag`
  return await requestHandler("post", url, {data : {userId, hashtag}})
}

export const updateUserSelectionPrivate = async (userId : string, selectionId : number) => {
  const url = `/api/users/${userId}/selections/private`
  return await requestHandler("put", url, {data : {userId, selectionId}})
}

export const deleteSelection = async (selectionId : number, selectionType? : TuserSelection) => {
  const params = new URLSearchParams();
  if(selectionType) params.append(QUERY_STRING_NAME.userSelection, selectionType)
  const url = `/api/selections/${selectionId}`
  const finalUrl = `${url}?${params.toString()}`;
  return await requestHandler("delete", finalUrl)
}

export const deleteUserHashTag = async (userId : string, userHashtagId : number) => {
  const url = `/api/users/${userId}/hashtag`
  try {
  await axios.delete(url, {
    data: {
      userId,
      userHashtagId
    }
  });
} catch (error) {
  throw new Error("Failed to remove bookmarks");
}
}

export const getUserHashTag = async (userId : string) => {
  const url = `/api/users/${userId}/hashtag`
  return await requestHandler("get", url)
}

export const getUserSelectionList = async (
  userId: string | string[],
  userSelectionType?: TuserSelection,
  sort?: string,
  page?: string,
  limit?: string
) => {
  const url = `api/users/${userId}/selections`;
  const params = new URLSearchParams();
  if (userSelectionType) params.append(QUERY_STRING_NAME.userSelection, userSelectionType);
  if (sort) params.append(QUERY_STRING_NAME.sort, sort);
  if (page) params.append(QUERY_STRING_NAME.page, page);
  if (limit) params.append(QUERY_STRING_NAME.limit, limit);

  const finalUrl = `${url}?${params.toString()}`;
  return await requestHandler("get", finalUrl);
};
