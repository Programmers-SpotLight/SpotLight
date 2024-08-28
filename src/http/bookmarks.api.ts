import axios from "axios";
import { requestHandler } from "./http";

export const addBookMarks = async (selectionId: number) => {
  try {
    const url = `/api/selections/${selectionId}/bookmarks`;
    await requestHandler("post", url, {
      selectionId
    });
  } catch (error) {
    throw new Error("Failed to add bookmarks");
  }
};

export const removeBookMarks = async (selectionId: number) => {
  try {
    const url = `/api/selections/${selectionId}/bookmarks`;
    await axios.delete(url, {
      data: {
        selectionId
      }
    });
  } catch (error) {
    throw new Error("Failed to remove bookmarks");
  }
};
