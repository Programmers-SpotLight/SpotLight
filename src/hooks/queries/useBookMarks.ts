import { useGetSearchParams } from "@/components/search/SearchResultSection";
import { useGetUserSelectionListParams } from "@/components/user/my/UserSelectionSection";
import { QUERY_KEY } from "@/constants/queryKey.constants";
import { addBookMarks, removeBookMarks } from "@/http/bookmarks.api";
import {
  IsearchResult,
  ItempResult,
  TsortType
} from "@/models/searchResult.model";
import { ISelectionInfo } from "@/models/selection.model";
import {
  QueryClient,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export const useBookMarks = (
  selectionId: number,
  userId: number,
  pageName?: string
) => {
  const { category_id, region_id, tags, sort, page, limit } =
    useGetSearchParams();
  const {
    userId: userSelectionUserId,
    userSelectionType,
    sort: userSelectionSort,
    page: userSelectionPage,
    limit: userSelectionLimit
  } = useGetUserSelectionListParams();

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const searchResultQueryKey = [
    QUERY_KEY.SELECTION,
    category_id,
    region_id,
    tags,
    sort,
    page,
    limit
  ];

  const userSelectionQueryKey = [
    QUERY_KEY.SELECTION,
    userSelectionUserId,
    userSelectionType,
    userSelectionSort,
    userSelectionPage,
    userSelectionLimit
  ];

  const { mutate: addBookMarksMutate } = useMutation({
    mutationKey: [QUERY_KEY.BOOKMARK, selectionId],
    mutationFn: () => addBookMarks(selectionId, userId),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.SELECTION],
        exact: false
      });

      if (session?.user) {
        const previousSelectionDetail = updateSelectionDetailData(
          queryClient,
          selectionId,
          true
        );

        const previousSearchResult = updateSearchResultData(
          queryClient,
          searchResultQueryKey,
          selectionId,
          true
        );

        const previousUserSelection = updateUserSelectionData(
          queryClient,
          userSelectionQueryKey,
          selectionId,
          true
        );

        return {
          previousSelectionDetail,
          previousSearchResult,
          previousUserSelection
        };
      }
    },

    onError: (error, variables, context) => {
      // 에러 발생 시 롤백 (이전 데이터로 복구)
      queryClient.setQueryData(
        [QUERY_KEY.SELECTION, selectionId],
        context?.previousSelectionDetail
      );

      queryClient.setQueryData(
        searchResultQueryKey,
        context?.previousSearchResult
      );

      queryClient.setQueryData(
        userSelectionQueryKey,
        context?.previousUserSelection
      );

      if (!session?.user) toast.info("로그인이 필요한 서비스입니다.");
      else toast.error("북마크에 추가하는 데 실패했습니다.");
    },
    onSuccess: (data, variables, context) => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      // queryClient.setQueryData([QUERY_KEY.SELECTION, selectionId], {
      //   ...context?.previousSelectionDetail,
      //   booked: true
      // });
      toast.success("북마크에 추가했습니다.");
    },
    onSettled: () => {
      // if (pageName && pageName === "detail") return;

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SELECTION],
        exact: false
      });
    }
  });

  const { mutate: removeBookMarksMutate } = useMutation({
    mutationKey: [QUERY_KEY.BOOKMARK, selectionId],
    mutationFn: () => removeBookMarks(selectionId, userId),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.SELECTION]
      });

      const previousSelectionDetail = updateSelectionDetailData(
        queryClient,
        selectionId,
        false
      );

      const previousSearchResult = updateSearchResultData(
        queryClient,
        searchResultQueryKey,
        selectionId,
        false
      );

      const previousUserSelection = updateUserSelectionData(
        queryClient,
        userSelectionQueryKey,
        selectionId,
        false
      );

      return {
        previousSelectionDetail,
        previousSearchResult,
        previousUserSelection
      };
    },

    onError: (error, variables, context) => {
      // 에러 발생 시 롤백 (이전 데이터로 복구)
      queryClient.setQueryData(
        [QUERY_KEY.SELECTION, selectionId],
        context?.previousSelectionDetail
      );

      queryClient.setQueryData(
        searchResultQueryKey,
        context?.previousSearchResult
      );

      queryClient.setQueryData(
        userSelectionQueryKey,
        context?.previousUserSelection
      );
      toast.error("북마크에서 제거하는 데 실패했습니다.");
    },
    onSuccess: (data, variables, context) => {
      // API 요청이 성공하면 데이터 수동으로 업데이트
      // queryClient.setQueryData([QUERY_KEY.SELECTION, selectionId], {
      //   ...context?.previousSelectionDetail,
      //   booked: false
      // });
      toast.success("북마크에서 제거했습니다.");
    },
    onSettled: () => {
      // if (pageName && pageName === "detail") return;

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SELECTION],
        exact: false
      });
    }
  });

  return { addBookMarksMutate, removeBookMarksMutate };
};

const updateSelectionDetailData = (
  queryClient: QueryClient,
  selectionId: number,
  booked: boolean
) => {
  const previousSelectionDetail = queryClient.getQueryData<ISelectionInfo>([
    QUERY_KEY.SELECTION,
    selectionId
  ]);

  if (previousSelectionDetail) {
    queryClient.setQueryData([QUERY_KEY.SELECTION, selectionId], {
      ...previousSelectionDetail,
      booked
    });
  }

  return previousSelectionDetail;
};

const updateSearchResultData = (
  queryClient: QueryClient,
  searchResultQueryKey: (string | string[])[],
  selectionId: number,
  booked: boolean
) => {
  const previousSearchResult =
    queryClient.getQueryData<IsearchResult>(searchResultQueryKey);

  if (previousSearchResult) {
    const updatedSearchResult = {
      ...previousSearchResult,
      data: previousSearchResult.data.map((selection) =>
        selection.selectionId === selectionId
          ? { ...selection, booked }
          : selection
      )
    };

    queryClient.setQueryData(searchResultQueryKey, updatedSearchResult);
  }

  return previousSearchResult;
};

const updateUserSelectionData = (
  queryClient: QueryClient,
  userSelectionQueryKey: (string | number)[],
  selectionId: number,
  booked: boolean
) => {
  const previousUserSelection = queryClient.getQueryData<
    IsearchResult | ItempResult
  >(userSelectionQueryKey);

  if (previousUserSelection) {
    const updatedSearchResult = {
      ...previousUserSelection,
      data: previousUserSelection.data.map((selection) =>
        selection.selectionId === selectionId
          ? { ...selection, booked }
          : selection
      )
    };

    queryClient.setQueryData(userSelectionQueryKey, updatedSearchResult);
  }

  return previousUserSelection;
};
