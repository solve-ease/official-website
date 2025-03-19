import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch blog posts with filtering, sorting, and pagination
 */
export const fetchBlogPosts = async ({ 
  search = '', 
  page = 1, 
  limit = 9, 
  tags = [], 
  sort = 'date_desc' 
}) => {
  try {
    // Convert tags array to comma-separated string if needed
    const tagParam = Array.isArray(tags) 
      ? tags.map(tag => tag.id || tag).join(',') 
      : tags;
    
    const response = await api.get('/blog/posts', {
      params: {
        search,
        page,
        limit,
        tags: tagParam,
        sort,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

/**
 * Fetch all available tags for blog posts
 */
export const fetchAllTags = async () => {
  try {
    const response = await api.get('/blog/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    throw error;
  }
};

/**
 * Fetch a single blog post by slug
 */
// export const fetchBlogPostBySlug = async (slug) => {
//   try {
//     const response = await api.get(`/blog/posts/${slug}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching blog post ${slug}:`, error);
//     throw error;
//   }
// };

/**
 * Fetch a single blog post by slug
 */
export const fetchBlogPostBySlug = async (slug) => {
    try {
      const response = await api.get(`/blog/posts/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog post ${slug}:`, error);
      throw error;
    }
  };
  
  /**
   * Fetch related blog posts based on a post's tags or category
   */
  export const fetchRelatedPosts = async (postId, limit = 3) => {
    try {
      const response = await api.get(`/blog/posts/${postId}/related`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching related posts:', error);
      throw error;
    }
  };
  
  /**
   * Increment view count for a blog post
   */
  export const incrementPostViewCount = async (postId) => {
    try {
      const response = await api.post(`/blog/posts/${postId}/view`);
      return response.data;
    } catch (error) {
      console.error('Error incrementing post view count:', error);
      // Silently fail - this is not critical functionality
      return null;
    }
  };
  
  /**
   * Submit a comment on a blog post
   */
  export const submitComment = async (postId, commentData) => {
    try {
      const response = await api.post(`/blog/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error submitting comment:', error);
      throw error;
    }
  };
  
  /**
   * Fetch comments for a blog post
   */
  export const fetchComments = async (postId, params = {}) => {
    try {
      const response = await api.get(`/blog/posts/${postId}/comments`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  };
  
  /**
   * Subscribe to blog newsletter
   */
  export const subscribeToNewsletter = async (email) => {
    try {
      const response = await api.post('/blog/newsletter/subscribe', { email });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  };