import { ISelectSelection } from "@/models/selection.model";
import { requestHandler } from "./http";


export const fetchDataForSelectionTemporaryEdit = async (selectionId: number): Promise<ISelectSelection> => {
  const response = await requestHandler('get', `/api/temporary-selections/${selectionId}`);
  return response;
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
  const response = await requestHandler('get', `/api/selections/${selectionId}/details-for-edit`);
  return response;
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