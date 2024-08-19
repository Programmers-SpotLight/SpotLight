import { IFeedbackFormData } from "@/components/common/modal/modal-contents/ModalFeedbackForm";
import { sendFeedback } from "@/http/feedback.api";
import { useModalStore } from "@/stores/modalStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useStore } from "zustand";

export const useSendFeedback = (formData: IFeedbackFormData) => {
  const { closeModal } = useStore(useModalStore);
  const {
    mutate: send,
    isError,
    isPending
  } = useMutation({
    mutationKey: ["feedback"],
    mutationFn: () => sendFeedback(formData),
    onSuccess: () => {
      closeModal();
      toast.success("성공적으로 전송되었습니다.");
    },
    onError: () => {
      toast.error("전송에 실패했습니다.");
    }
  });

  return { send, isPending };
};
