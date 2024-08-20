import { addBookMarks, removeBookMarks } from "@/http/bookmarks.api";
import { ISelectionInfo } from "@/models/selection.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
      toast.error("북마크에 추가하는 데 실패했습니다.");
    },
    onSuccess: (data, variables, context) => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      queryClient.setQueryData(["selection", selectionId], {
        ...context?.previousSelection,
        booked: true
      });

      toast.success("북마크에 추가했습니다.");
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
      toast.success("북마크에서 제거하는 데 실패했습니다.");
    },
    onSuccess: (data, variables, context) => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      queryClient.setQueryData(["selection", selectionId], {
        ...context?.previousSelection,
        booked: false
      });

      toast.success("북마크에서 제거했습니다.");
    }
  });

  return { addBookMarksMutate, removeBookMarksMutate };
};
