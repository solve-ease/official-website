import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, className, ...props }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`py-8 md:py-12 ${className || ''}`}
      {...props}
    >
      {children}
    </motion.section>
  );
};

export default Section;