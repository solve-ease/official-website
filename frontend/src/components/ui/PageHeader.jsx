import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, description, backgroundImage }) => {
  return (
    <div 
      className="relative bg-blue-900 text-white"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-blue-900 bg-opacity-75"></div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          {title}
        </motion.h1>
        
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;