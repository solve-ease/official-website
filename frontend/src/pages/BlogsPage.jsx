import React, { useState, Suspense } from 'react';
import { useQuery } from 'react-query';
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

// Lazy loaded components for code splitting
const BlogDetailView = React.lazy(() => import('../components/blog/BlogDetailView'));

const  BlogsPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('date_desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debounce search to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Items per page
  const ITEMS_PER_PAGE = 9;
  
  // Fetch blog posts with react-query
  const { data, isLoading, error } = useQuery(
    ['blogPosts', debouncedSearchTerm, currentPage, selectedTags, sortBy],
    () => fetchBlogPosts({
      search: debouncedSearchTerm,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      tags: selectedTags,
      sort: sortBy
    }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

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
  );
};

export default BlogsPage;