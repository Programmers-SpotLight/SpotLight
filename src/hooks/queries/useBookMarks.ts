import {
  addBookMarks,
  getBookMarks,
  removeBookMarks
} from "@/http/bookmarks.api";
import { ISelectionInfo } from "@/models/selection.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export const useBookMarks = (selectionId: number, userId: number) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { data: isBookmarked } = useQuery({
    queryKey: ["bookmark", selectionId],
    queryFn: () => getBookMarks(selectionId)
  });

  const { mutate: addBookMarksMutate } = useMutation({
    mutationKey: ["bookmark", selectionId],
    mutationFn: () => addBookMarks(selectionId, userId),

    onMutate: async () => {
      const previousSelection = queryClient.getQueryData<ISelectionInfo>([
        "bookmark",
        selectionId
      ]);

      await queryClient.cancelQueries({
        queryKey: ["bookmark", selectionId]
      });

      if (session?.user) {
        queryClient.setQueryData(["bookmark", selectionId], {
          ...previousSelection,
          booked: true
        });
      }

      return { previousSelection };
    },

    onError: (error, variables, context) => {
      // 에러 발생 시 롤백 (이전 데이터로 복구)
      queryClient.setQueryData(
        ["bookmark", selectionId],
        context?.previousSelection
      );
      if (!session?.user) toast.info("로그인이 필요한 서비스입니다.");
      else toast.error("북마크에 추가하는 데 실패했습니다.");
    },
    onSettled: () => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      queryClient.invalidateQueries({
        queryKey: ["bookmark", selectionId]
      });
      // queryClient.setQueryData(["bookmark", selectionId], {
      //   ...context?.previousSelection,
      //   booked: true
      // });

      toast.success("북마크에 추가했습니다.");
    }
  });

  const { mutate: removeBookMarksMutate } = useMutation({
    mutationKey: ["bookmark", selectionId],
    mutationFn: () => removeBookMarks(selectionId, userId),

    onMutate: async () => {
      const previousSelection = queryClient.getQueryData<ISelectionInfo>([
        "bookmark",
        selectionId
      ]);

      await queryClient.cancelQueries({
        queryKey: ["bookmark", selectionId]
      });
      queryClient.setQueryData(["bookmark", selectionId], {
        ...previousSelection,
        booked: false
      });

      return { previousSelection };
    },

    onError: (error, variables, context) => {
      // 에러 발생 시 롤백 (이전 데이터로 복구)
      queryClient.setQueryData(
        ["bookmark", selectionId],
        context?.previousSelection
      );
      toast.success("북마크에서 제거하는 데 실패했습니다.");
    },
    onSettled: () => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      // queryClient.setQueryData(["bookmark", selectionId], {
      //   ...context?.previousSelection,
      //   booked: false
      // });
      queryClient.invalidateQueries({
        queryKey: ["bookmark", selectionId]
      });
      toast.success("북마크에서 제거했습니다.");
    }
  });

  return { isBookmarked, addBookMarksMutate, removeBookMarksMutate };
};
