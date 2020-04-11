import { AxiosClient } from 'app/requests';
import { E621APIPostsMeta } from 'app/slices/e621APISlice';

export const getSearchParams = (search: string, paramName: string) => {
  const params = new URLSearchParams(search);
  return params.getAll(paramName).reduce<string[]>((prev, curr) => {
    curr.split(' ').forEach((item) => {
      if (item.length > 0) {
        prev.push(item.trim());
      }
    });
    return prev;
  }, []);
};

export const generateSearchQuery = (tags: string[]) => {
  const filteredTags = tags.filter((x) => x.length > 0);
  return filteredTags.length > 0
    ? `?tags=${filteredTags.map((tag) => tag.trim()).join(' ')}`
    : '';
};

export const isEqualTags = (prevTags: string[], currTags: string[]) => {
  return (
    prevTags.length === currTags.length &&
    prevTags.every((x) => currTags.includes(x))
  );
};

export type SearchComparison = {
  meta: E621APIPostsMeta;
  client: AxiosClient;
};

export const isEqualSearch = (
  search1: SearchComparison,
  search2: SearchComparison
) =>
  search1.meta.limit === search2.meta.limit &&
  search1.client === search2.client &&
  isEqualTags(search1.meta.tags, search2.meta.tags);
