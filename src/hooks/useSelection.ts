import { requestHandler } from "@/http/http";

export const useSelection = async (selectionId: string | string[]) => {
  try {
    const response = await requestHandler(
      "get",
      `/api/selections/${selectionId}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Failed to fetch selection:", error);
    return null;
  }
};
