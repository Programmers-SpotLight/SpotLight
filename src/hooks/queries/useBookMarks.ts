import { useGetSearchParams } from "@/components/search/SearchResultSection";
import { QUERY_KEY } from "@/constants/queryKey.constants";
import { addBookMarks, removeBookMarks } from "@/http/bookmarks.api";
import { IsearchResult, TsortType } from "@/models/searchResult.model";
import { ISelectionInfo } from "@/models/selection.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export const useBookMarks = (selectionId: number, userId: number) => {
  const { category_id, region_id, tags, sort, page, limit } =
    useGetSearchParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const searchResultQueryKey = [
    QUERY_KEY.SEARCH_RESULT,
    category_id,
    region_id,
    tags,
    sort,
    page,
    limit
  ];

  const { mutate: addBookMarksMutate } = useMutation({
    mutationKey: [QUERY_KEY.BOOKMARK, selectionId],
    mutationFn: () => addBookMarks(selectionId, userId),

    onMutate: async () => {
      const previousSelection = queryClient.getQueryData<ISelectionInfo>([
        QUERY_KEY.SELECTION,
        selectionId
      ]);

      const previousSearchResult =
        queryClient.getQueryData<IsearchResult>(searchResultQueryKey);

      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.SELECTION, selectionId]
      });

      await queryClient.cancelQueries({
        queryKey: searchResultQueryKey
      });

      if (session?.user) {
        queryClient.setQueryData([QUERY_KEY.SELECTION, selectionId], {
          ...previousSelection,
          booked: true
        });

        if (previousSearchResult) {
          const updatedSearchResult = {
            ...previousSearchResult,
            data: previousSearchResult.data.map((selection) =>
              selection.selectionId === selectionId
                ? { ...selection, booked: true }
                : selection
            )
          };

          queryClient.setQueryData(searchResultQueryKey, updatedSearchResult);
        }
      }

      return { previousSelection, previousSearchResult };
    },

    onError: (error, variables, context) => {
      // 에러 발생 시 롤백 (이전 데이터로 복구)
      queryClient.setQueryData(
        [QUERY_KEY.SELECTION, selectionId],
        context?.previousSelection
      );

      queryClient.setQueryData(
        searchResultQueryKey,
        context?.previousSearchResult
      );

      if (!session?.user) toast.info("로그인이 필요한 서비스입니다.");
      else toast.error("북마크에 추가하는 데 실패했습니다.");
    },
    onSuccess: (data, variables, context) => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      queryClient.setQueryData([QUERY_KEY.SELECTION, selectionId], {
        ...context?.previousSelection,
        booked: true
      });
      toast.success("북마크에 추가했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: searchResultQueryKey
      });
    }
  });

  const { mutate: removeBookMarksMutate } = useMutation({
    mutationKey: [QUERY_KEY.BOOKMARK, selectionId],
    mutationFn: () => removeBookMarks(selectionId, userId),

    onMutate: async () => {
      const previousSelection = queryClient.getQueryData<ISelectionInfo>([
        QUERY_KEY.SELECTION,
        selectionId
      ]);

      const previousSearchResult =
        queryClient.getQueryData<IsearchResult>(searchResultQueryKey);

      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.SELECTION, selectionId]
      });

      await queryClient.cancelQueries({
        queryKey: searchResultQueryKey
      });

      queryClient.setQueryData([QUERY_KEY.SELECTION, selectionId], {
        ...previousSelection,
        booked: false
      });

      if (previousSearchResult) {
        const updatedSearchResult = {
          ...previousSearchResult,
          data: previousSearchResult.data.map((selection) =>
            selection.selectionId === selectionId
              ? { ...selection, booked: false }
              : selection
          )
        };

        queryClient.setQueryData(searchResultQueryKey, updatedSearchResult);
      }

      return { previousSelection, previousSearchResult };
    },

    onError: (error, variables, context) => {
      // 에러 발생 시 롤백 (이전 데이터로 복구)
      queryClient.setQueryData(
        [QUERY_KEY.SELECTION, selectionId],
        context?.previousSelection
      );

      queryClient.setQueryData(
        searchResultQueryKey,
        context?.previousSearchResult
      );
      toast.error("북마크에서 제거하는 데 실패했습니다.");
    },
    onSuccess: (data, variables, context) => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      queryClient.setQueryData([QUERY_KEY.SELECTION, selectionId], {
        ...context?.previousSelection,
        booked: false
      });
      toast.success("북마크에서 제거했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: searchResultQueryKey
      });
    }
  });

  return { addBookMarksMutate, removeBookMarksMutate };
};
