import React from 'react';
import { RadioStation } from '../types';
import Visualizer from './Visualizer';

interface PlayerProps {
  station: RadioStation;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 001-1V8a1 1 0 00-1-1H8zm3 0a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 001-1V8a1 1 0 00-1-1h-1z" />
    </svg>
);


const Player: React.FC<PlayerProps> = ({ station, isPlaying, onTogglePlayPause, audioRef }) => {
  const fallbackImage = 'https://picsum.photos/seed/radio/300';
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  const animeCharUrl = 'https://media.tenor.com/s6j25T_2csAAAAi/anime-boy.gif';

  return (
    <div className="relative bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl p-6 sm:p-8 overflow-hidden">
      
      <Visualizer audioRef={audioRef} isPlaying={isPlaying} />

      <div className={`absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-20 transition-opacity duration-700 ease-in-out ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <img 
              src={animeCharUrl} 
              alt="Dancing anime character" 
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
          />
      </div>


      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        <div className="relative w-64 h-64 flex items-center justify-center">
            <img 
              src={station.favicon} 
              alt={station.name}
              onError={handleImageError}
              className={`w-56 h-56 rounded-full object-cover shadow-lg shadow-black/30 transition-transform duration-500 ${isPlaying ? 'animate-slow-spin' : ''}`} 
            />
            <div className={`absolute inset-[1rem] rounded-full ring-4 ring-pink-500/70 transition-opacity duration-500 ${isPlaying ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
        </div>
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold truncate max-w-md">{station.name}</h2>
          <p className="text-slate-400 text-lg">{station.country || 'Live Radio'}</p>
        </div>

        <button
          onClick={onTogglePlayPause}
          className="text-pink-400 bg-slate-900/50 rounded-full w-20 h-20 flex items-center justify-center hover:bg-slate-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </div>
  );
};

export default Player;