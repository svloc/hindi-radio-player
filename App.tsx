import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RadioStation } from './types';
import { fetchHindiStations } from './services/radioService';
import RadioCard from './components/RadioCard';
import Player from './components/Player';
import Loader from './components/Loader';
import Header from './components/Header';
import ErrorDisplay from './components/ErrorDisplay';
import Tabs from './components/Tabs';

const NowPlayingPlaceholder = () => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center flex flex-col items-center justify-center aspect-square border border-slate-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-13c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
        </svg>
        <p className="text-slate-400 mt-4 font-semibold">Select a station</p>
        <p className="text-slate-500 text-sm">...to start listening.</p>
    </div>
);

const NoFavoritesPlaceholder = () => (
    <div className="text-center py-10 px-4 bg-slate-800/50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69L11.049 2.927z" />
        </svg>
        <p className="text-slate-400 mt-4 font-semibold">No Favorites Yet</p>
        <p className="text-slate-500 text-sm mt-1">Click the star on a station to add it here.</p>
    </div>
);


const App: React.FC = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
        const savedFavorites = localStorage.getItem('hindi-radio-favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
        console.error("Could not parse favorites from localStorage", error);
        return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadStations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedStations = await fetchHindiStations();
        setStations(fetchedStations);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadStations();
  }, []);
  
  useEffect(() => {
    try {
        localStorage.setItem('hindi-radio-favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error("Could not save favorites to localStorage", error);
    }
  }, [favorites]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentStation) {
        if (audioRef.current.src !== currentStation.url_resolved) {
          audioRef.current.src = currentStation.url_resolved;
        }
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentStation]);


  const handleSelectStation = useCallback((station: RadioStation) => {
    if (currentStation?.stationuuid === station.stationuuid) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  }, [currentStation]);

  const togglePlayPause = useCallback(() => {
    if (currentStation) {
      setIsPlaying(prev => !prev);
    }
  }, [currentStation]);

  const toggleFavorite = useCallback((stationuuid: string) => {
    setFavorites(prev => 
        prev.includes(stationuuid)
            ? prev.filter(id => id !== stationuuid)
            : [...prev, stationuuid]
    );
  }, []);

  const displayedStations = React.useMemo(() => {
    if (activeTab === 'favorites') {
        return stations.filter(station => favorites.includes(station.stationuuid));
    }
    return stations;
  }, [activeTab, stations, favorites]);

  return (
    <div className="bg-slate-900/70 min-h-screen text-slate-200 font-sans backdrop-blur-xl">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Right Panel: Player (60%) - Placed first in code for mobile view */}
            <div className="lg:col-span-3 lg:sticky top-24 h-fit lg:order-last">
                {currentStation ? (
                    <Player
                        station={currentStation}
                        isPlaying={isPlaying}
                        onTogglePlayPause={togglePlayPause}
                        audioRef={audioRef}
                    />
                ) : (
                    <NowPlayingPlaceholder />
                )}
            </div>

            {/* Left Panel: Station List (40%) - Placed second for mobile view */}
            <div className="lg:col-span-2 space-y-4 lg:order-first">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                {isLoading && <Loader />}
                {error && <ErrorDisplay message={error} />}
                {!isLoading && !error && (
                    <div className="space-y-3">
                        {displayedStations.length > 0 ? (
                          displayedStations.map(station => (
                              <RadioCard
                                  key={station.stationuuid}
                                  station={station}
                                  isPlaying={isPlaying && currentStation?.stationuuid === station.stationuuid}
                                  isFavorite={favorites.includes(station.stationuuid)}
                                  onSelectStation={handleSelectStation}
                                  onToggleFavorite={toggleFavorite}
                              />
                          ))
                        ) : (
                          <NoFavoritesPlaceholder />
                        )}
                    </div>
                )}
            </div>
        </div>
      </main>
      <audio ref={audioRef} crossOrigin="anonymous"></audio>
    </div>
  );
};

export default App;