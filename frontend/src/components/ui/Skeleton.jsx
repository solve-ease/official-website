import React from 'react';

const Skeleton = ({ type }) => {
  switch (type) {
    case 'blog-card':
      return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-5">
            <div className="flex gap-2 mb-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-6 w-16 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            
            <div className="flex justify-between mt-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default Skeleton;