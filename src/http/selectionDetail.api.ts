import { requestHandler } from "@/http/http";

export const fetchSelectionDetailInfo = async (selectionId: number) => {
  try {
    const response = await requestHandler(
      "get",
      `/api/selections/${selectionId}`
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch selection:", error);
    return null;
  }
};
