import axios from "axios";
import { requestHandler } from "./http";

export const getBookMarks = async (selectionId: number) => {
  try {
    const url = `/api/selections/${selectionId}/bookmarks`;
    const response = await requestHandler("get", url, {
      selectionId
    });
    return response ? true : false;
  } catch (error) {
    throw new Error("Failed to get bookmarks");
  }
};

export const addBookMarks = async (selectionId: number, userId: number) => {
  try {
    const url = `/api/selections/${selectionId}/bookmarks`;
    await requestHandler("post", url, {
      selectionId,
      userId
    });
  } catch (error) {
    throw new Error("Failed to add bookmarks");
  }
};

export const removeBookMarks = async (selectionId: number, userId: number) => {
  try {
    const url = `/api/selections/${selectionId}/bookmarks`;
    await axios.delete(url, {
      data: {
        selectionId,
        userId
      }
    });
  } catch (error) {
    throw new Error("Failed to remove bookmarks");
  }
};
