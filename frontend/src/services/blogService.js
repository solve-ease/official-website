

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// import adarshImg from "../assets/am-goel.jpg";

const adarshImg = "https://auto-doc-seven.vercel.app/am-pic.png"
// Create an axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('access_token');

// Attach JWT token to request headers if available
const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    const tagParam = Array.isArray(tags) 
      ? tags.map(tag => tag.id || tag).join(',') 
      : tags;
    
    const response = await api.get('/blog/posts', {
      params: { search, page, limit, tags: tagParam, sort },
    });
    
    console.log(response.data);
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
 * @param {string} slug - The slug of the blog post
 * @returns {Promise} - The blog post data
 */
export const fetchBlogPostBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/blog/posts/${slug}`);
    return normalizeBlogPostData(response.data);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

/**
 * Fetch related posts for a blog post
 * @param {string} postId - The ID of the current blog post
 * @param {number} limit - Number of related posts to fetch
 * @returns {Promise} - Array of related blog posts
 */
export const fetchRelatedPosts = async (postId, limit = 3) => {
  try {
    const response = await axios.get(`${API_URL}/blog/posts/${postId}/related?limit=${limit}`);
    return response.data.map(post => normalizeBlogPostData(post));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};

/**
 * Increment the view count for a blog post
 * @param {string} postId - The ID of the blog post
 */
export const incrementPostViewCount = async (postId) => {
  try {
    await axios.post(`${API_URL}/blog/posts/${postId}/views`);
  } catch (error) {
    console.error('Error incrementing post view count:', error);
  }
};

/**
 * Normalize blog post data to match the frontend component requirements
 * @param {Object} post - The raw blog post data from the API
 * @returns {Object} - Normalized blog post data
 */
function normalizeBlogPostData(post) {
  return {
    id: post.id,
    title: post.meta_title,
    content: post.content,
    excerpt: post.excerpt,
    slug: post.slug,
    featuredImage: post.featured_image,
    publishedAt: post.published_at,
    createdAt: post.created_at,
    readingTime: post.reading_time,
    viewsCount : post.view_count || 0,
    tags: post.tags || [],
    author: {
      id: post.author_id,
      name: post.author_name || `Author #${post.author_id}`,
      avatar: post.author_avatar || adarshImg,
      bio: post.author_bio || "I'm an Entrepreneur, buildling solutions for world's pressing problems using latest tools and technology like Gen AI, Blockchain, etc.I love hackathons and working with bright minds towards building sustainable solutions and having fun with bugs in the code.",
      role: post.author_role || 'Technical Expert  ',
    },
    featured: post.featured || false
  };
}

/**
 * Submit a comment on a blog post
 */
export const submitComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/blog/posts/${postId}/comments`, commentData, {
      headers: authHeaders(),
    });
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
    // debug step
    // console.log(response.data);
    
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

/**
 * Fetch all newsletter subscribers (requires authentication)
 */
export const fetchNewsletterSubscribers = async () => {
  try {
    const response = await api.get('/blog/newsletter/subscribers', {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    throw error;
  }
};

/**
 * Create a new blog post
 */
export const createBlogPost = async (postData) => {
  try {
    const response = await api.post('/blog/posts', postData, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (postId, postData) => {
  try {
    const response = await api.put(`/blog/posts/${postId}`, postData, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

/**
 * Delete a blog post
 */
export const deleteBlogPost = async (postId) => {
  try {
    const response = await api.delete(`/blog/posts/${postId}`, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

