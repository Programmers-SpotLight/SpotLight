import { TsortType } from '@/models/searchResult.model';
import { requestHandler } from './http';

export const fetchSearchResult = async (
  category?: string,
  region?: string,
  tags?: string[],
  sort?: TsortType
) => {
  const url = 'api/selections/search';

  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (region) params.append('region', region);
  if (tags) tags.forEach(tag => params.append('tags', tag));
  if (sort) params.append('sort', sort);

  const finalUrl = `${url}?${params.toString()}`;

  return await requestHandler('get', finalUrl);
};
