import { getUserInfo } from "@/http/user.api";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserInfo = (selectionId: string) => {
    return useQuery({
      queryKey: ["userinfo", selectionId],
      queryFn: () => getUserInfo(selectionId)
    });
    };
  