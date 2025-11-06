import React from 'react';

const MusicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-13c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
    </svg>
);

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-slate-900/70 backdrop-blur-md shadow-lg shadow-black/20 border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <MusicIcon />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-white">
            Hindi Radio Wave
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
