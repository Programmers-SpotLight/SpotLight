import { updateUserDescription } from "@/http/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateUserDescription = (userId: string, description: string) => {
  const queryClient = useQueryClient();

  const { mutate: userUpd} = useMutation({
    mutationKey: ["userDescription", userId],
    mutationFn: () => updateUserDescription(userId, description),

    onMutate: async () => {
      const previousDescription = queryClient.getQueryData<{
        description: string;
      }>(["userinfo", userId]);

      await queryClient.cancelQueries({
        queryKey: ["userinfo", userId]
      });

      queryClient.setQueryData(
        ["userinfo", userId],
        (oldData: any) => ({
          ...oldData,
          description
        })
      );

      return { previousDescription };
    },

    onError: (error, variables, context) => {
        queryClient.setQueryData(
          ["userinfo", userId],
          context?.previousDescription
        );
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(["userinfo", userId], {
        ...context?.previousDescription,
        description
      });
    }
  });

  return { userUpd };
};

export default useUpdateUserDescription;
