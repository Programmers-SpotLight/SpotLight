import { QUERY_KEY } from "@/constants/queryKey.constants";
import { deleteSelection } from "@/http/user.api";
import { TuserSelection } from "@/models/user.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useDeleteSelection = () => {
  const queryClient = useQueryClient();
  const { mutate: handleDeleteSelection } = useMutation({
    mutationKey: ["selectionDelete"],
    mutationFn: ({
      selectionId,
      selectionType
    }: {
      selectionId: number;
      selectionType?: TuserSelection;
    }) => deleteSelection(selectionId, selectionType),
    onError: () => {
      toast.error("오류가 발생하였습니다");
    },
    onSuccess: () => {
      toast.success("성공적으로 삭제하였습니다.");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SELECTION], exact : false});
      queryClient.invalidateQueries({ queryKey: ["userinfo"] });
    }
  });

  return { handleDeleteSelection };
};

export default useDeleteSelection;
