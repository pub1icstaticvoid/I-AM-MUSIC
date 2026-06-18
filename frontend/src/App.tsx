import { useState } from 'react';
import type { Artist, Track } from './types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchScreen from './components/SearchScreen';
import ArtistPage from './components/ArtistPage';
import BracketPage from './components/BracketPage';
import './App.css';

const DUMMY_ARTISTS: Artist[] = [
  { id: "1", name: "Hatsune Miku" },
  { id: "2", name: "JPEGMAFIA" },
  { id: "3", name: "kessoku band" }
];

const DUMMY_TRACKS: Track[] = Array.from( { length: 20 }, (_, i) => ({
  id: `t${i}`,
  name: `Dummy Song ${i + 1}`
}));

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setselectedArtist] = useState<Artist | null>(null);
  const [bracketSongs, setBracketSongs] = useState<Track[]>([]);

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    // fetch from last.fm here
    console.log(`searching  last.fm for: ${searchQuery}`);
  };

  const handleStartBracket = () => {
    const shuffled = [...DUMMY_TRACKS].sort(() => 0.5 - Math.random());
    const selectedForBracket = shuffled.slice(0, 8);

    setBracketSongs(selectedForBracket);
  };

  const resetState = () => {
    setSearchQuery("");
    setselectedArtist(null);
    setBracketSongs([]);
  };

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