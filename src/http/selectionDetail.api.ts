import { requestHandler } from "@/http/http";
import { handleHttpError } from "@/utils/errors";
import axios from "axios";

export const fetchSelectionDetailInfo = async (selectionId: number) => {
  try {
    const response = await requestHandler(
      "get",
      `/api/selections/${selectionId}`
    );
    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error)) handleHttpError(error);
    else throw new Error("An unexpected error occured");
  }
};
