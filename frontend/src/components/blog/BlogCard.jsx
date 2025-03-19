// import React from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { Calendar, Clock, User } from 'lucide-react';
// import { LazyLoadImage } from 'react-lazy-load-image-component';
// import parse from 'html-react-parser';
// import TagBadge from '../ui/TagBadge';

// const BlogCard = ({ post }) => {
//   console.log(post)
//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
//   };

//   return (
//     <motion.div 
//       variants={cardVariants}
//       className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       <Link to={`/blog/${post.slug}`} className="block">
//         <div className="relative h-48 overflow-hidden">
//           <LazyLoadImage
//             src={post.featuredImage}
//             alt={post.title}
//             className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
//             effect="blur"
//             placeholderSrc="/images/placeholder.jpg"
//           />
//           {post.featured && (
//             <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium">
//               Featured
//             </div>
//           )}
//         </div>
//       </Link>
      
//       <div className="p-5">
//         <div className="flex flex-wrap gap-2 mb-3">
//           {post.tags.slice(0, 3).map(tag => (
//             <TagBadge key={tag.id} tag={tag} />
//           ))}
//         </div>
        
//         <Link to={`/blog/${post.slug}`} className="block">
//           <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
//             {post.title}
//           </h3>
//         </Link>
        
//         <div className="text-gray-600 mb-4 line-clamp-3">
//           {parse(post.excerpt)}
//         </div>
        
//         <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
//           <div className="flex items-center">
//             <User size={14} className="mr-1" />
//             {/* <span>{post.author.name}</span> */}
//           </div>
          
//           <div className="flex items-center gap-3">
//             <div className="flex items-center">
//               <Calendar size={14} className="mr-1" />
//               <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
//             </div>
            
//             <div className="flex items-center">
//               <Clock size={14} className="mr-1" />
//               <span>{post.readingTime} min read</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default BlogCard;


import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import parse from 'html-react-parser';
import TagBadge from '../ui/TagBadge';

const BlogCard = ({ post }) => {
  console.log(post);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Format date properly
  const formattedDate = new Date(post.published_at).toLocaleDateString();
  
  // Default tags if not provided
  const tags = post.tags || [];
  
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <LazyLoadImage
            src={post.featured_image || '/images/placeholder.jpg'}
            alt={post.meta_title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            effect="blur"
            placeholderSrc="/images/placeholder.jpg"
          />
          {post.featured && (
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium">
              Featured
            </div>
          )}
          {post.status === "published" && (
            <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-medium">
              Published
            </div>
          )}
        </div>
      </Link>
     
      <div className="p-5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map(tag => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
       
        <Link to={`/blog/${post.slug}`} className="block">
          <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
            {post.meta_title}
          </h3>
        </Link>
       
        <div className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt ? parse(post.excerpt) : parse(post.content.substring(0, 150) + '...')}
        </div>
       
        <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>Author #{post.author_id}</span>
          </div>
         
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
           
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{post.reading_time} min read</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;