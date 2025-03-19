import { useQuery } from 'react-query';
import { fetchBlogPosts } from '../services/blogService';

export const useBlogPosts = ({ 
  search = '', 
  page = 1, 
  limit = 9, 
  tags = [], 
  sort = 'date_desc' 
}) => {
  return useQuery(
    ['blogPosts', search, page, tags, sort],
    () => fetchBlogPosts({ search, page, limit, tags, sort }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};