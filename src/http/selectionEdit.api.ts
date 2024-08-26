import { ISelectSelection } from "@/models/selection.model";
import { requestHandler } from "./http";
import { handleHttpError } from "@/utils/errors";
import axios from "axios";


export const fetchDataForSelectionTemporaryEdit = async (selectionId: number): Promise<ISelectSelection> => {
  try {
    const response = await requestHandler('get', `/api/temporary-selections/${selectionId}`);
    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error)) handleHttpError(error);
    else throw new Error("An unexpected error occurred");
  }
};

export const submitTemporarySelectionEdit = async (selectionId: number, selectionData: FormData): Promise<any> => {
  const response = await requestHandler<FormData>(
    'put', 
    `/api/temporary-selections/${selectionId}`, 
    selectionData, 
    {headers: {'Content-Type': 'multipart/form-data'}}
  );
  return response;
}

export const fetchDataForSelectionEdit = async (selectionId: number): Promise<ISelectSelection> => {
  try {
    const response = await requestHandler('get', `/api/selections/${selectionId}/details-for-edit`);
    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error)) handleHttpError(error);
    else throw new Error("An unexpected error occurred");
  }
}

export const submitSelectionEdit = async (selectionId: number, selectionData: FormData): Promise<any> => {
  const response = await requestHandler<FormData>(
    'put', 
    `/api/selections/${selectionId}`, 
    selectionData, 
    {headers: {'Content-Type': 'multipart/form-data'}}
  );
  return response;
}