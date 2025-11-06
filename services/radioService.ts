import { RadioStation } from '../types';

const API_URL = 'https://de1.api.radio-browser.info/json/stations/search?language=hindi&tag=music&hidebroken=true&order=votes&reverse=true&limit=300';

export const fetchHindiStations = async (): Promise<RadioStation[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.statusText}`);
    }
    const data: RadioStation[] = await response.json();
    
    // Filter out stations without a valid, resolved stream URL and with a favicon
    return data
      .filter(station => station.url_resolved && station.favicon);
    // Sorting is now handled by the API request
  } catch (error) {
    console.error('Error fetching radio stations:', error);
    throw new Error('Could not connect to the radio station directory. Please try again later.');
  }
};