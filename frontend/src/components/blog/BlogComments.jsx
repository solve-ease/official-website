
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, User } from 'lucide-react';
import { fetchComments, submitComment } from '../../services/blogService';

const BlogComments = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch comments
  const loadComments = async () => {
    try {
      const data = await fetchComments(postId);
      // Since the API returns an array directly, update state accordingly
      setComments(data);
    } catch (err) {
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await submitComment(postId, { name, email, content: comment });
      // Reload comments after successful submission
      loadComments();
      setComment('');
      setName('');
      setEmail('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <MessageCircle size={20} className="mr-2" />
        Comments ({comments.length})
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
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (not published)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
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
          <p className="text-center text-gray-600">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-600">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((commentItem) => (
            <motion.div key={commentItem.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <User size={16} className="text-blue-600 mr-2" />
                <h4 className="font-medium">{commentItem.name}</h4>
              </div>
              <p className="text-gray-700 mt-2">{commentItem.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogComments;
