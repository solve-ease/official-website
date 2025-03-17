import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowLeft,
  BookmarkPlus,
  MessageCircle,
  Heart,
  Tag,
  Copy
} from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import parse from 'html-react-parser';
import { 
  fetchBlogPostBySlug, 
  fetchRelatedPosts,
  incrementPostViewCount
} from '../services/blogService';
import Section from '../components/layout/Section';
import TagBadge from '../components/ui/TagBadge';
import BlogCard from '../components/blog/BlogCard';
import NewsletterSubscribe from '../components/blog/NewsletterSubscribe';
import BlogComments from '../components/blog/BlogComments';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Fetch blog post
  const { 
    data: post, 
    isLoading: isPostLoading, 
    error: postError 
  } = useQuery(
    ['blogPost', slug],
    () => fetchBlogPostBySlug(slug),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      onError: (error) => {
        // Redirect to 404 page if post not found
        if (error.response && error.response.status === 404) {
          navigate('/blog/not-found', { replace: true });
        }
      }
    }
  );
  
  // Fetch related posts
  const { 
    data: relatedPosts, 
    isLoading: isRelatedLoading 
  } = useQuery(
    ['relatedPosts', post?.id],
    () => fetchRelatedPosts(post.id),
    {
      enabled: !!post?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Track view count
  useEffect(() => {
    if (post?.id) {
      incrementPostViewCount(post.id);
    }
  }, [post?.id]);
  
  // Copy URL to clipboard
  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show a toast notification
    // toast.success('URL copied to clipboard!');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  // Show loading state
  if (isPostLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (postError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't seem to exist or has been moved.</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Image */}
      <div className="relative h-80 md:h-96 lg:h-[500px] overflow-hidden">
        <LazyLoadImage
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
          effect="blur"
          placeholderSrc="/images/placeholder.jpg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-white gap-y-2 gap-x-6">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{post.author.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2"
            >
              {/* Back to blog link */}
              <motion.div variants={itemVariants} className="mb-6">
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to all articles
                </Link>
              </motion.div>
              
              {/* Article content */}
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8"
              >
                <div className="prose prose-lg max-w-none">
                  {parse(post.content)}
                </div>
              </motion.div>
              
              {/* Tags */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap items-center gap-2 mb-8"
              >
                <span className="text-gray-700 flex items-center">
                  <Tag size={16} className="mr-1" />
                  Tags:
                </span>
                {post.tags.map(tag => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </motion.div>
              
              {/* Share buttons */}
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6 mb-8"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Share2 size={18} className="mr-2" />
                  Share this article
                </h3>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook size={18} />
                  </button>
                  
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                    className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter size={18} />
                  </button>
                  
                  <button 
                    onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`, '_blank')}
                    className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin size={18} />
                  </button>
                  
                  <button 
                    onClick={copyPageUrl}
                    className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                    aria-label="Copy link"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </motion.div>
              
              {/* Author info */}
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6 mb-8"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  
                  <div>
                    <h3 className="font-semibold text-lg">{post.author.name}</h3>
                    <p className="text-gray-600 text-sm">{post.author.role}</p>
                  </div>
                </div>
                
                <p className="mt-4 text-gray-700">{post.author.bio}</p>
              </motion.div>
              
              {/* Comments section */}
              <motion.div variants={itemVariants}>
                <BlogComments postId={post.id} />
              </motion.div>
            </motion.div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6 mb-8"
                >
                  <div className="flex gap-4">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <BookmarkPlus size={16} />
                      <span>Save</span>
                    </button>
                    
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                      <MessageCircle size={16} />
                      
                      <span>Comment</span>
                    </button>
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 py-2 mt-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    <Heart size={16} />
                    <span>Like this article</span>
                  </button>
                </motion.div>
                
                {/* Newsletter subscription */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-blue-50 rounded-lg shadow-md p-6 mb-8"
                >
                  <NewsletterSubscribe />
                </motion.div>
                
                {/* Related articles */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                  
                  {isRelatedLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-24 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : relatedPosts?.length ? (
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link 
                          key={relatedPost.id} 
                          to={`/blog/${relatedPost.slug}`}
                          className="flex gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                        >
                          <img 
                            src={relatedPost.featuredImage} 
                            alt={relatedPost.title}
                            className="w-20 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800 line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(relatedPost.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No related articles found.</p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default BlogDetailPage;