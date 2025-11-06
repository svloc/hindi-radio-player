import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500"></div>
      <p className="ml-4 text-lg text-slate-300">Loading Stations...</p>
    </div>
  );
};

export default Loader;
