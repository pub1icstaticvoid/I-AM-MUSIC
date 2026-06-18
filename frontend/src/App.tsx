import { useState } from 'react';
import type { Artist, Track } from './types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { filterTracks, removeDupes } from './utils/trackFilters';
import SearchScreen from './components/SearchScreen';
import ArtistPage from './components/ArtistPage';
import BracketPage from './components/BracketPage';
import './App.css';

const DUMMY_ARTISTS: Artist[] = [
  { id: "1", name: "Hatsune Miku" },
  { id: "2", name: "JPEGMAFIA" },
  { id: "3", name: "kessoku band" },
  { id: "4", name: "Death Grips" }
];

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setselectedArtist] = useState<Artist | null>(null);
  const [bracketSongs, setBracketSongs] = useState<Track[]>([]);

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    // fetch from last.fm here
    console.log(`searching  last.fm for: ${searchQuery}`);
  };

  const handleStartBracket = async (artistName: string) => {
    const tracks = await fetchArtistTracks(artistName);

    setBracketSongs(tracks);
  };

  const resetState = () => {
    setSearchQuery("");
    setselectedArtist(null);
    setBracketSongs([]);
  };

  const fetchArtistTracks = async (artistName: string) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=500&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const tracks = removeDupes(filterTracks(data.toptracks.track));

      const shuffled = [...tracks].sort(() => 0.5 - Math.random());
      const selectedForBracket = shuffled.slice(0, 8);

      return selectedForBracket;
    }
    catch (error) {
      console.error("failed to fetch tracks: ", error);
      return [];
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/' 
          element={<SearchScreen 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            dummyArtists={DUMMY_ARTISTS}
            setSelectedArtist={setselectedArtist}
          />}
        />

        <Route 
          path='/artist/:artistName'
          element={<ArtistPage 
            selectedArtist={selectedArtist}
            handleStartBracket={handleStartBracket}
          />}
        />

        <Route 
          path='/bracket/:artistName'
          element={<BracketPage 
            resetState={resetState}
            selectedArtist={selectedArtist}
            bracketSongs={bracketSongs}
          />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App