import { updateUserSelectionPrivate } from "@/http/user.api";
import { useMutation } from "@tanstack/react-query";

const useUpdateUserSelectionPrivate = (userId: string) => {

  const { mutate: selectionPrivate} = useMutation({
    mutationKey: ["userSelectionPrivate", userId],
    mutationFn: (selectionId: number) => updateUserSelectionPrivate(userId, selectionId),
    onError: () => {
        alert("오류가 발생하였습니다") // 스낵메세지 대체
    }
  });

  return { selectionPrivate };
};

export default useUpdateUserSelectionPrivate;
