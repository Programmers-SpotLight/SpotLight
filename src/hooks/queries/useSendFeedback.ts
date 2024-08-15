import { IFeedbackFormData } from "@/components/common/modal/modal-contents/ModalFeedbackForm";
import { sendFeedback } from "@/http/feedback.api";
import { useModalStore } from "@/stores/modalStore";
import { useMutation } from "@tanstack/react-query";
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
      alert("성공적으로 전송되었습니다.");
    },
    onError: () => {
      alert("전송에 실패했습니다.");
    }
  });

  return { send, isPending };
};
