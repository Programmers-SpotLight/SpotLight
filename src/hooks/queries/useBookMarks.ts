import { addBookMarks, removeBookMarks } from "@/http/bookmarks.api";
import { ISelectionInfo } from "@/models/selection.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBookMarks = (selectionId: number, userId: number) => {
  const queryClient = useQueryClient();

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
    onSuccess: (data, variables, context) => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      queryClient.setQueryData(["selection", selectionId], {
        ...context?.previousSelection,
        booked: true
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
    onSuccess: (data, variables, context) => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      queryClient.setQueryData(["selection", selectionId], {
        ...context?.previousSelection,
        booked: false
      });
    }
  });

  return { addBookMarksMutate, removeBookMarksMutate };
};
