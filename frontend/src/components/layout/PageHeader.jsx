import React from 'react';

const PageHeader = ({ title, description, backgroundImage }) => {
  return (
    <div 
      className="relative w-full h-64 bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-lg sm:text-xl opacity-90">{description}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
