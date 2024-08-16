import { deleteSelection } from "@/http/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteSelection = () => {
const queryClient = useQueryClient();
  const { mutate: handleDeleteSelection } = useMutation({

    mutationKey: ["selectionDelete"],
    mutationFn: (selectionId: number) => deleteSelection(selectionId),
    onError: () => {
        alert("오류가 발생하였습니다")
    },
    onSuccess: () => {
        alert("성공적으로 삭제하였습니다.")
        queryClient.invalidateQueries({ queryKey: ['userSelectionList'] });
    }

  });

  return { handleDeleteSelection };
};

export default useDeleteSelection;
