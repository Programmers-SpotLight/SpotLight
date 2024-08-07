import { TsortType } from '@/models/searchResult.model';
import { requestHandler } from './http';
import { QUERY_STRING_NAME } from '@/constants/queryString';

export const fetchSearchResult = async (
  category_id?: string,
  region_id?: string,
  tags?: string[],
  sort?: TsortType,
  page? : string,
  limit? : string
) => {
  const url = 'api/selections/search';

  const params = new URLSearchParams();
  
  if (category_id) params.append(QUERY_STRING_NAME.category_id, category_id);
  if (region_id) params.append(QUERY_STRING_NAME.region_id, region_id);
  if (tags) tags.forEach(tag => params.append(QUERY_STRING_NAME.tags, tag));
  if (sort) params.append(QUERY_STRING_NAME.sort, sort);
  if (page) params.append(QUERY_STRING_NAME.page, page);
  if (limit) params.append(QUERY_STRING_NAME.limit, limit);

  const finalUrl = `${url}?${params.toString()}`;

  return await requestHandler('get', finalUrl);
};

export const fetchSelectionCategories  = async () => {
  const url = "api/selections/categories";
  return await requestHandler('get', url)
}

export const fetchSelectionLocations = async () => {
  const url ="api/selections/locations"
  return await requestHandler('get', url)
};