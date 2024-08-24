import { QUERY_STRING_NAME } from "@/constants/queryString.constants";
import { TuserSelection } from "@/models/user.model";
import { requestHandler } from "./http";
import axios from "axios";
import { handleHttpError } from "@/utils/errors";

export const getUserInfo = async (userId: string) => {
  try {
    const url = `/api/users/${userId}/`;
    return await requestHandler("get", url);
  } catch (error) {
    if (axios.isAxiosError(error)) handleHttpError(error);
    else throw new Error("An unexpected error occured");
  }
};

export const updateUserDescription = async (
  userId: string,
  description: string
) => {
  const url = `/api/users/${userId}/description`;
  return await requestHandler("put", url, { description });
};

export const addUserHashTag = async (userId: string, hashtag: string) => {
  const url = `/api/users/${userId}/hashtag`;
  console.log(hashtag)
  return await requestHandler("post", url, { data : {hashtag}});
};

export const updateUserSelectionPrivate = async (
  userId: number,
  selectionId: number
) => {
  const url = `/api/users/${userId}/selections/private`;
  return await requestHandler("put", url, { selectionId });
};

export const deleteSelection = async (
  selectionId: number,
  selectionType?: TuserSelection
) => {
  const params = new URLSearchParams();
  if (selectionType) params.append(QUERY_STRING_NAME.userSelection, selectionType);
  const url = `/api/selections/${selectionId}`;
  const finalUrl = `${url}?${params.toString()}`;
  return await requestHandler("delete", finalUrl);
};

export const deleteUserHashTag = async (
  userId: string,
  userHashtagId: number
) => {
  const url = `/api/users/${userId}/hashtag`;
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
};

export const getUserHashTag = async (userId: string) => {
  try {
    const url = `/api/users/${userId}/hashtag`;
    return await requestHandler("get", url);
  } catch (error) {
    if (axios.isAxiosError(error)) handleHttpError(error);
    else throw new Error("An unexpected error occured");
  }
};

export const getUserSelectionList = async (
  userId: string | string[],
  userSelectionType?: TuserSelection,
  sort?: string,
  page?: string,
  limit?: string,
  isMyPage?: boolean
) => {
  const url = `api/users/${userId}/selections`;
  const params = new URLSearchParams();
  if (userSelectionType)
    params.append(QUERY_STRING_NAME.userSelection, userSelectionType);
  if (sort) params.append(QUERY_STRING_NAME.sort, sort);
  if (page) params.append(QUERY_STRING_NAME.page, page);
  if (limit) params.append(QUERY_STRING_NAME.limit, limit);
  if (isMyPage !== undefined) params.append(QUERY_STRING_NAME.is_my_page, isMyPage ? "true" : "false");

  const finalUrl = `${url}?${params.toString()}`;
  return await requestHandler("get", finalUrl);
};

export const updateUserProfileImage = async (
  userId : number,
  imgUrl : string
) => {
  const url = `api/users/${userId}/profile`;
  return await requestHandler("put", url, {imgUrl})
}