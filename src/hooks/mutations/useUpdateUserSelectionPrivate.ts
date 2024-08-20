import { updateUserSelectionPrivate } from "@/http/user.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateUserSelectionPrivate = (userId: string) => {
  const { mutate: selectionPrivate } = useMutation({
    mutationKey: ["userSelectionPrivate", userId],
    mutationFn: (selectionId: number) =>
      updateUserSelectionPrivate(userId, selectionId),
    onError: () => {
      toast.error("오류가 발생하였습니다");
    }
  });

  return { selectionPrivate };
};

export default useUpdateUserSelectionPrivate;
