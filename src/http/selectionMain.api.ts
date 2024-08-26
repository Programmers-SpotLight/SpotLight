import { IsearchData } from "@/models/searchResult.model";
import { requestHandler } from "./http";
import { handleHttpError } from "@/utils/errors";
import axios from "axios";

export const getPopularSelections = async (): Promise<IsearchData[]> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/selections/popular`);
  
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
  
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

export const getRecommendationSelections = async () : Promise<any> => {
  try {
    const url = `/api/selections/recommendations`;
    return await requestHandler("get", url);
  } catch (error) {
    if (axios.isAxiosError(error)) handleHttpError(error);
    else throw new Error("An unexpected error occured");
  }
}