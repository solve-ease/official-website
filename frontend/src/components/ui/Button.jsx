import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', ...props }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }} // Adds a click animation
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
