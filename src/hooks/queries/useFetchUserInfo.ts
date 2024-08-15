import { IResponseGetUserHashtag } from "@/app/api/users/[userId]/hashtag/route";
import { getUserHashTag, getUserInfo } from "@/http/user.api";
import { IUserInfoMapping } from "@/models/user.model";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useFetchUserInfo = (userId: string) : UseQueryResult<IUserInfoMapping> => {
    return useQuery({
      queryKey: ["userinfo", userId],
      queryFn: () => getUserInfo(userId)
    });
    };

export const useFetchUserHashtag = (userId : string) : UseQueryResult<IResponseGetUserHashtag> => {
  return useQuery({
    queryKey: ["getUserHashtag", userId],
    queryFn: () => getUserHashTag(userId)
  });
};