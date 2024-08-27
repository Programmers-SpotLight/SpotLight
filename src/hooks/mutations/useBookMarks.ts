import { IColCardProps } from "@/components/common/card/ColCard";
import { useGetSearchParams } from "@/components/search/SearchResultSection";
import { useGetUserSelectionListParams } from "@/components/user/my/UserSelectionSection";
import { QUERY_KEY } from "@/constants/queryKey.constants";
import { addBookMarks, removeBookMarks } from "@/http/bookmarks.api";
import { IsearchResult, ItempResult } from "@/models/searchResult.model";
import { ISelectionInfo } from "@/models/selection.model";
import { useModalStore } from "@/stores/modalStore";
import {
  QueryClient,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export const useBookMarks = (selectionId: number) => {
  const { category_id, region_id, tags, sort, page, limit } =
    useGetSearchParams();
  const {
    userId: userSelectionUserId,
    userSelectionType,
    sort: userSelectionSort,
    page: userSelectionPage,
    limit: userSelectionLimit
  } = useGetUserSelectionListParams();
  const { openModal } = useModalStore();
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

  const recommendationQueryKey = [QUERY_KEY.SELECTION, QUERY_KEY.RECOMMEND];

  const { mutate: addBookMarksMutate } = useMutation({
    mutationKey: [QUERY_KEY.BOOKMARK, selectionId],
    mutationFn: () => addBookMarks(selectionId),

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

        const previousRecommendationSelection = updateRecommendationData(
          queryClient,
          recommendationQueryKey,
          selectionId,
          true
        );

        return {
          previousSelectionDetail,
          previousSearchResult,
          previousUserSelection,
          previousRecommendationSelection
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

      queryClient.setQueryData(
        recommendationQueryKey,
        context?.previousRecommendationSelection
      );

      if (!session?.user) {
        openModal("signin");
        toast.info("로그인이 필요한 서비스입니다.");
      } else toast.error("북마크에 추가하는 데 실패했습니다.");
    },
    onSuccess: (data, variables, context) => {
      toast.success("북마크에 추가했습니다.");
    },
    onSettled: () => { 
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SELECTION],
        exact: false,
        predicate: (query) => {
          return !query.queryKey.includes(QUERY_KEY.RECOMMEND);
        },
      });
    }
  });

  const { mutate: removeBookMarksMutate } = useMutation({
    mutationKey: [QUERY_KEY.BOOKMARK, selectionId],
    mutationFn: () => removeBookMarks(selectionId),

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

      const previousRecommendationSelection = updateRecommendationData(
        queryClient,
        recommendationQueryKey,
        selectionId,
        false
      );

      return {
        previousSelectionDetail,
        previousSearchResult,
        previousUserSelection,
        previousRecommendationSelection
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

      queryClient.setQueryData(
        recommendationQueryKey,
        context?.previousRecommendationSelection
      );
      toast.error("북마크에서 제거하는 데 실패했습니다.");
    },
    onSuccess: (data, variables, context) => {
      toast.success("북마크에서 제거했습니다.");
    },
    onSettled: () => { 
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SELECTION],
        exact: false,
        predicate: (query) => {
          return !query.queryKey.includes(QUERY_KEY.RECOMMEND);
        },
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
    console.log
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

const updateRecommendationData = (
  queryClient: QueryClient,
  recommendationQueryKey: (string | number)[],
  selectionId: number,
  booked: boolean
) => {
  const previousRecommendation = queryClient.getQueryData<IColCardProps[]>(
    recommendationQueryKey
  );

  if (previousRecommendation) {
    const updatedRecommendation = previousRecommendation.map((selection) =>
      selection.selectionId === selectionId
        ? { ...selection, booked }
        : selection
    );
    queryClient.setQueryData(recommendationQueryKey, updatedRecommendation);
  }

  return previousRecommendation;
};
