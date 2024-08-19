import { requestHandler } from "@/http/http";
import { NotFoundError } from "@/utils/errors";

export const fetchSelectionDetailInfo = async (selectionId: number) => {
  try {
    const response = await requestHandler(
      "get",
      `/api/selections/${selectionId}`
    );
    return response;
  } catch (error: any) {
    const status = error.response.status;
    if (status === 404)
      throw new NotFoundError("셀렉션 정보를 찾을 수 없습니다.");
  }
};
