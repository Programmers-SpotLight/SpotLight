import { updateUserProfileImage } from "@/http/user.api";
import { ErrorResponse, SuccessResponse } from "@/models/user.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

const useUpdateUserProfileImage = () => {
  const queryClient = useQueryClient();

  const { mutate: userProfileUpdate } = useMutation({
    mutationKey: ["userProfileImage"],
    mutationFn: ({ userId, imgFile }: { userId: string; imgFile: File }) => 
      updateUserProfileImage(userId, imgFile),
    onError: (error : AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.error);
    },
    onSuccess: (message : AxiosResponse<SuccessResponse>) => {
      toast.success("성공적으로 프로필 이미지를 변경하였습니다.");
      queryClient.invalidateQueries({ queryKey: ["userinfo"] });
    }
  });

  return { userProfileUpdate };
};

export default useUpdateUserProfileImage;
