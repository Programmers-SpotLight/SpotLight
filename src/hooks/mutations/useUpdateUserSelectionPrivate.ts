import { updateUserSelectionPrivate } from "@/http/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateUserSelectionPrivate = (userId: number) => {
  const queryClient = useQueryClient();
  
  const { mutate: selectionPrivate, } = useMutation({
    mutationKey: ["userSelectionPrivate"],
    mutationFn: (selectionId: number) =>
      updateUserSelectionPrivate(userId, selectionId),
    onError: () => {
      toast.error("오류가 발생하였습니다");
    }
  });

  return { selectionPrivate, queryClient };
};

export default useUpdateUserSelectionPrivate;
