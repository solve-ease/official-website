import React from 'react';
import BlogCard from './BlogCard';
import Skeleton from '../ui/Skeleton';

const BlogGrid = ({ posts, isLoading, error }) => {
  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} type="blog-card" />
        ))}
      </div>
    );
  }
  
  // Show error message if error occurred
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load blog posts</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }
  
  // Show empty state if no posts
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }
  
  // Render blog posts grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogGrid;
