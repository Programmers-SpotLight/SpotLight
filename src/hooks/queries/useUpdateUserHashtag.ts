import { IResponseGetUserHashtag } from "@/app/api/users/[userId]/hashtag/route";
import { addUserHashTag, deleteUserHashTag } from "@/http/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddUserHashtag = (userId: string) => {
  const queryClient = useQueryClient();

  const { mutate: AddHtag } = useMutation({
    mutationKey: ["addUserHashtag"],
    mutationFn: (hashtag: string) => addUserHashTag(userId, hashtag),

    onMutate: async (newHashtag) => {
      await queryClient.cancelQueries({ queryKey: ["getUserHashtag"] });

      const previousData = queryClient.getQueryData<IResponseGetUserHashtag>([
        "getUserHashtag",
        userId
      ]);

      queryClient.setQueryData(
        ["getUserHashtag", userId],
        (oldData: IResponseGetUserHashtag) => {
          return {
            ...oldData,
            data: [
              ...oldData.data,
              {
                htag_id: Date.now(),
                user_htag_id : Date.now(),
                htag_name: newHashtag,
                htag_type: "none"
              }
            ]
          };
        }
      );

      return { previousData };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["getUserHashtag", userId],
        context?.previousData
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserHashtag"] });
      queryClient.invalidateQueries({ queryKey: ["userinfo"]})
    }
  });

  return { AddHtag };
};

export const useDeleteHashtag = (userId: string) => {
  const queryClient = useQueryClient();

  const { mutate: deleteHtag } = useMutation({
    mutationKey: ["deleteUserHashtag"],
    mutationFn: (userHashtagId: number) => deleteUserHashTag(userId, userHashtagId),
    onMutate: async (userHashtagId) => {
      await queryClient.cancelQueries({ queryKey: ["getUserHashtag"] });

      const previousData = queryClient.getQueryData<IResponseGetUserHashtag>([ "getUserHashtag",
        userId
      ]);

      queryClient.setQueryData(
        ["getUserHashtag", userId],
        (oldData: IResponseGetUserHashtag) => {
          return {
            ...oldData,
            data: oldData.data.filter(
              (hashtag) => hashtag.user_htag_id !== userHashtagId
            )
          };
        }
      );

      return { previousData };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["getUserHashtag", userId],
        context?.previousData
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserHashtag"] });
      queryClient.invalidateQueries({ queryKey: ["userinfo"]})

    }
  });

  return { deleteHtag };
};
