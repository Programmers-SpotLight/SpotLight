import { deleteSelection } from "@/http/user.api";
import { TuserSelection } from "@/models/user.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteSelection = () => {
const queryClient = useQueryClient();
  const { mutate: handleDeleteSelection } = useMutation({

    mutationKey: ["selectionDelete"],
    mutationFn: ({ selectionId, selectionType }: { selectionId: number, selectionType?: TuserSelection }) => deleteSelection(selectionId, selectionType),
    onError: () => {
        alert("오류가 발생하였습니다")
    },
    onSuccess: () => {
        alert("성공적으로 삭제하였습니다.")
        queryClient.invalidateQueries({predicate: (query) => query.queryKey[0] === 'userSelectionList'});
        queryClient.invalidateQueries({queryKey:["userinfo"]})    
      }

  });

  return { handleDeleteSelection };
};

export default useDeleteSelection;
