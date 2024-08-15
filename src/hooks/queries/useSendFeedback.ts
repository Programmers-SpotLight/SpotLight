import { IFeedbackFormData } from "@/components/common/modal/modal-contents/ModalFeedbackForm";
import { sendFeedback } from "@/http/feedback.api";
import { useMutation } from "@tanstack/react-query";

export const useSendFeedback = (formData: IFeedbackFormData) => {
  const {
    mutate: send,
    isError,
    isPending
  } = useMutation({
    mutationKey: ["feedback"],
    mutationFn: () => sendFeedback(formData)
  });

  return { send, isError, isPending };
};
