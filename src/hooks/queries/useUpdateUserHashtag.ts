import { addUserHashTag, deleteUserHashTag } from "@/http/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddUserHashtag = (userId: string) => {
  const queryClient = useQueryClient();

  const { mutate: AddHtag } = useMutation({
    mutationKey: ["addUserHashtag"],
    mutationFn: (hashtag : string) => addUserHashTag(userId, hashtag),

    onError: (error, variables, context) => {
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getUserHashtag"] });
    }
  });

  return { AddHtag };
};

export const useDeleteHashtag = (userId: string) => {
  const queryClient = useQueryClient();

  const { mutate: deleteHtag } = useMutation({
    mutationKey: ["deleteUserHashtag"],
    mutationFn: (userHashtagId: number) => deleteUserHashTag(userId, userHashtagId),
    onError: (error) => {
      console.error("Error deleting hashtag:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserHashtag"] });
    }
  });

  return { deleteHtag };
};