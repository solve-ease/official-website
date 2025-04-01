import React from 'react';

const Input = ({ type = 'text', className = '', ...props }) => {
  return (
    <input
      type={type}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Input;
