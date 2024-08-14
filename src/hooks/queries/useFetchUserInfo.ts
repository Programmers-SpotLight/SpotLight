import { getUserInfo } from "@/http/user.api";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserInfo = (userId: string) => {
    return useQuery({
      queryKey: ["userinfo", userId],
      queryFn: () => getUserInfo(userId)
    });
    };
  