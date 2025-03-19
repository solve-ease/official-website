import React from 'react';
import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlogPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (event) => {
    onPageChange(event.selected + 1);
  };

  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center">
      <ReactPaginate
        previousLabel={<ChevronLeft size={16} />}
        nextLabel={<ChevronRight size={16} />}
        breakLabel="..."
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        forcePage={currentPage - 1}
        containerClassName="flex items-center space-x-1"
        pageClassName="flex"
        pageLinkClassName="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        activeLinkClassName="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
        previousClassName="flex"
        nextClassName="flex"
        previousLinkClassName="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        nextLinkClassName="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        breakClassName="flex"
        breakLinkClassName="px-3 py-2 text-gray-500"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  );
};

export default BlogPagination;