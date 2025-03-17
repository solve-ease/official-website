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