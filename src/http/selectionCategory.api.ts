import {
  ISelectionCategory,
  ISelectionLocation,
  ISelectionSpotCategory
} from "@/models/selection.model";
import { requestHandler } from "./http";

export const fetchSelectionCategories: () => Promise<
  ISelectionCategory[]
> = async () => {
  const response = await requestHandler("get", "/api/selections/categories");
  return response;
};

export const fetchSelectionLocations: () => Promise<
  ISelectionLocation[]
> = async () => {
  const response = await requestHandler("get", "/api/selections/locations");
  return response;
};

export const fetchSelectionSpotCategories: () => Promise<
  ISelectionSpotCategory[]
> = async () => {
  const response = await requestHandler(
    "get",
    "/api/selections/spots/categories"
  );
  return response;
};
