import { IsearchData } from "@/models/searchResult.model";

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