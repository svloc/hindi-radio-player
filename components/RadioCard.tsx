import React from 'react';
import { RadioStation } from '../types';

interface RadioCardProps {
  station: RadioStation;
  isPlaying: boolean;
  isFavorite: boolean;
  onSelectStation: (station: RadioStation) => void;
  onToggleFavorite: (stationuuid: string) => void;
}

const PlayingIndicator = () => (
  <div className="flex items-center space-x-1">
      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-75"></span>
      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></span>
      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-150"></span>
  </div>
);

const FavoriteButton = ({ isFavorite, onClick }: { isFavorite: boolean; onClick: (e: React.MouseEvent) => void }) => (
    <button
        onClick={onClick}
        className="p-2 rounded-full text-slate-500 hover:text-yellow-400 hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={isFavorite}
    >
        {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69L11.049 2.927z" />
            </svg>
        )}
    </button>
);

const RadioCard: React.FC<RadioCardProps> = ({ station, isPlaying, isFavorite, onSelectStation, onToggleFavorite }) => {
  const fallbackImage = 'https://picsum.photos/seed/radio/200';
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(station.stationuuid);
  };

  return (
    <div
      onClick={() => onSelectStation(station)}
      className={`relative group bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-md p-3 flex items-center space-x-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-slate-700/60 hover:shadow-pink-500/20 hover:scale-[1.02] ${isPlaying ? 'ring-2 ring-pink-500' : 'border border-transparent'}`}
      role="button"
      aria-pressed={isPlaying}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelectStation(station)}
    >
      <div className="flex-shrink-0">
        <img
          src={station.favicon}
          alt={station.name}
          onError={handleImageError}
          className="w-16 h-16 rounded-md object-cover shadow-sm"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate group-hover:text-pink-300 transition-colors">
          {station.name}
        </h3>
        <p className="text-sm text-slate-400 truncate">{station.country || 'Unknown'}</p>
      </div>
      <div className="flex items-center space-x-3">
        {isPlaying && <PlayingIndicator />}
        <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} />
      </div>
    </div>
  );
};

export default RadioCard;