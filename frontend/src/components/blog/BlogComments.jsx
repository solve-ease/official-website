import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import { MessageCircle, Send, User, ThumbsUp, Flag, MoreHorizontal } from 'lucide-react';
import { fetchComments, submitComment } from '../../services/blogService';

const BlogComments = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();
  
  // Fetch comments
  const { 
    data, 
    isLoading, 
    error: commentsError 
  } = useQuery(
    ['blogComments', postId],
    () => fetchComments(postId),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );
  
  // Submit comment mutation
  const submitCommentMutation = useMutation(
    (commentData) => submitComment(postId, commentData),
    {
      onSuccess: () => {
        // Invalidate and refetch comments
        queryClient.invalidateQueries(['blogComments', postId]);
        
        // Reset form
        setComment('');
        setIsSubmitting(false);
      },
      onError: (err) => {
        setError(err.response?.data?.message || 'Failed to submit comment. Please try again.');
        setIsSubmitting(false);
      }
    }
  );
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    submitCommentMutation.mutate({
      name,
      email,
      content: comment
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <MessageCircle size={20} className="mr-2" />
        Comments ({data?.total || 0})
      </h3>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (not published)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comments...</p>
          </div>
        ) : commentsError ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load comments. Please try again later.</p>
          </div>
        ) : data?.comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          data?.comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-2">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{comment.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-2 text-gray-700">{comment.content}</div>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <button className="flex items-center mr-4 hover:text-blue-600">
                  <ThumbsUp size={14} className="mr-1" />
                  <span>{comment.likes || 0}</span>
                </button>
                
                <button className="flex items-center hover:text-red-600">
                  <Flag size={14} className="mr-1" />
                  <span>Report</span>
                </button>
              </div>
              
              {/* Nested comments (replies) */}
              {comment.replies?.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-white rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full mr-2">
                          <User size={12} className="text-blue-600" />

                        </div>
                        <h4 className="font-medium">{reply.name}</h4>
                        </div>
                        <div className="text-gray-700">{reply.content}</div>

                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <button className="flex items-center mr-4 hover:text-blue-600">
                                <ThumbsUp size={12} className="mr-1" />
                                <span>{reply.likes || 0}</span>
                            </button>
    
                            <button className="flex items-center hover:text-red-600">
                                <Flag size={12} className="mr-1" />
                                <span>Report</span>
                            </button>

                        </div>
                    </div>
                    ))}
                </div>
                )}
            </motion.div>
            ))
        }
        </div>
    </div>
    );

};

export default BlogComments;