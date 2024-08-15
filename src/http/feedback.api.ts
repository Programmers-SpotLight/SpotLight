import { IFeedbackFormData } from "@/components/common/modal/modal-contents/ModalFeedbackForm";
import { requestHandler } from "./http";

export const sendFeedback = async (formData: IFeedbackFormData) => {
  try {
    const url = "/api/feedback";
    await requestHandler("post", url, formData);
  } catch (error) {
    throw new Error("Failed to send email");
  }
};
