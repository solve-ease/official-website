import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { fetchBlogPosts } from '../services/blogService';
import { useDebounce } from '../hooks/useDebounce';
import BlogGrid from '../components/blog/BlogGrid';
import BlogSearch from '../components/blog/BlogSearch';
import BlogSorting from '../components/blog/BlogSorting';
import BlogTagsFilter from '../components/blog/BlogTagsFilter';
import BlogPagination from '../components/blog/BlogPagination';
import PageHeader from '../components/layout/PageHeader';
import Section from '../components/layout/Section';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


// Lazy loaded components for code splitting
// const BlogDetailView = React.lazy(() => import('../components/blog/BlogDetailView'));

const BlogsPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('date_desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // States to replace react-query functionality
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Debounce search to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Items per page
  const ITEMS_PER_PAGE = 9;

  // Cache key generation function - creates a unique key based on our query parameters
  const generateCacheKey = (search, page, tags, sort) => {
    return `blogPosts_${search}_${page}_${tags.join('_')}_${sort}`;
  };
  
  // This effect replaces the react-query hook
  useEffect(() => {
    // Keep track of whether the component is mounted
    let isMounted = true;
    
    // Function to fetch blog posts
    const loadBlogPosts = async () => {
      setIsLoading(true);
      
      try {
        // Generate cache key for this specific query
        const cacheKey = generateCacheKey(
          debouncedSearchTerm,
          currentPage,
          selectedTags,
          sortBy
        );
        
        // Check if we have cached data that's not stale
        const cachedData = sessionStorage.getItem(cacheKey);
        const cachedTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
        const now = Date.now();
        const staleTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        // If we have fresh cached data, use it
        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp)) < staleTime) {
          if (isMounted) {
            setData(JSON.parse(cachedData));
            setIsLoading(false);
          }
          return;
        }
        
        // If no valid cached data, fetch fresh data
        const fetchedData = await fetchBlogPosts({
          search: debouncedSearchTerm,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          tags: selectedTags,
          sort: sortBy
        });
        
        // Only update state if the component is still mounted
        if (isMounted) {
          setData(fetchedData);
          setIsLoading(false);
          
          // Cache the result with timestamp
          sessionStorage.setItem(cacheKey, JSON.stringify(fetchedData));
          sessionStorage.setItem(`${cacheKey}_timestamp`, now.toString());
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };
    
    // Call the function to load blog posts
    loadBlogPosts();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm, currentPage, selectedTags, sortBy]); // Dependencies reflect the query keys from react-query
  
  // Animation variants for staggered animations
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
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleTagSelect = (tags) => {
    setSelectedTags(tags);
    setCurrentPage(1); // Reset to first page on tag filter
  };
  
  const handleSortChange = (value) => {
    setSortBy(value);
  };
  
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Our Blog"
        description="Insights, updates, and resources from the Solve Ease team"
        backgroundImage="/images/blog-header-bg.jpg"
      />
      
      <Section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <BlogSearch 
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search articles..."
              icon={<Search size={18} />}
            />
            
            <div className="flex items-center gap-3">
              <BlogSorting 
                value={sortBy}
                onChange={handleSortChange}
              />
              
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                <span className="hidden md:inline">Filters</span>
              </button>
            </div>
          </div>
          
          {/* Expandable Filter Section */}
          <motion.div
            initial={false}
            animate={{ height: isFilterOpen ? 'auto' : 0, opacity: isFilterOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <BlogTagsFilter 
                selectedTags={selectedTags}
                onChange={handleTagSelect}
              />
            </div>
          </motion.div>
          
          {/* Blog Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <BlogGrid 
              posts={data?.posts || []}
              isLoading={isLoading}
              error={error}
            />
          </motion.div>
          
          {/* Pagination */}
          {data && (
            <div className="mt-10">
              <BlogPagination 
                currentPage={currentPage}
                totalPages={Math.ceil(data.total / ITEMS_PER_PAGE)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </motion.div>
      </Section>
    </div>
    <Footer />
    </>
  );
};

export default BlogsPage;