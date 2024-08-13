import { addBookMarks, removeBookMarks } from "@/http/bookmarks.api";
import { ISelectionInfo } from "@/models/selection.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBookMarks = (selectionId: number, userId: number) => {
  const queryClient = useQueryClient();

  //queryKey 나중에 ["selection", selectionId] 이 아니라 ["user",userId]로 바꿔야 됨
  //ISelectionInfo의 booked도 빼고 user에서 북마크한 list들을 가지고 있어야 할 듯
  const { mutate: addBookMarksMutate } = useMutation({
    mutationKey: ["bookmark", selectionId],
    mutationFn: () => addBookMarks(selectionId, userId),

    onMutate: async () => {
      const previousSelection = queryClient.getQueryData<ISelectionInfo>([
        "selection",
        selectionId
      ]);

      await queryClient.cancelQueries({
        queryKey: ["selection", selectionId]
      });
      queryClient.setQueryData(["selection", selectionId], {
        ...previousSelection,
        booked: true
      });

      return { previousSelection };
    },

    onError: (error, variables, context) => {
      // 에러 발생 시 롤백 (이전 데이터로 복구)
      queryClient.setQueryData(
        ["selection", selectionId],
        context?.previousSelection
      );
    },
    onSettled: () => {
      // 요청이 성공 또는 실패했을 때, 쿼리 상태를 다시 갱신
      queryClient.invalidateQueries({
        queryKey: ["selection", selectionId]
      });
    }
  });

  const { mutate: removeBookMarksMutate } = useMutation({
    mutationKey: ["bookmark", selectionId],
    mutationFn: () => removeBookMarks(selectionId, userId),

    onMutate: async () => {
      const previousSelection = queryClient.getQueryData<ISelectionInfo>([
        "selection",
        selectionId
      ]);

      await queryClient.cancelQueries({
        queryKey: ["selection", selectionId]
      });
      queryClient.setQueryData(["selection", selectionId], {
        ...previousSelection,
        booked: false
      });

      return { previousSelection };
    },

    onError: (error, variables, context) => {
      // 에러 발생 시 롤백 (이전 데이터로 복구)
      queryClient.setQueryData(
        ["selection", selectionId],
        context?.previousSelection
      );
    },
    onSettled: () => {
      // 요청이 성공 또는 실패했을 때, 쿼리 상태를 다시 갱신
      queryClient.invalidateQueries({
        queryKey: ["selection", selectionId]
      });
    }
  });

  return { addBookMarksMutate, removeBookMarksMutate };
};
