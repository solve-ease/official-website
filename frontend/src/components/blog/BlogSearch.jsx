import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const BlogSearch = ({ value, onChange, placeholder, icon }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, width: '80%' }}
      animate={{ opacity: 1, width: '100%' }}
      className="relative w-full md:max-w-md"
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default BlogSearch;