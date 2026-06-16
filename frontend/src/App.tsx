import { useState } from 'react'
import type { Artist, Track } from './types'
import SearchScreen from './components/SearchScreen'
import ArtistPage from './components/ArtistPage'
import './App.css'
import BracketPage from './components/BracketPage'

export type ViewState = "search" | "artist-page" | "bracket";

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
  const [currentView, setCurrentView] = useState<ViewState>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setselectedArtist] = useState<Artist | null>(null);
  const [bracketSongs, setBracketSongs] = useState<Track[]>([]);

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    // fetch from last.fm here
    console.log(`searching  last.fm for: ${searchQuery}`);
  };

  const handleSelectArtist = (artist: Artist) => {
    setselectedArtist(artist);
    setCurrentView("artist-page");
  }

  const handleStartBracket = () => {
    const shuffled = [...DUMMY_TRACKS].sort(() => 0.5 - Math.random());
    const selectedForBracket = shuffled.slice(0, 8);

    setBracketSongs(selectedForBracket);
    setCurrentView("bracket");
  };

  const handleReset = () => {
    setCurrentView("search");
    setSearchQuery("");
    setselectedArtist(null);
    setBracketSongs([]);
  };

  return (
    <main>
      {currentView === "search" && (
        <SearchScreen 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          dummyArtists={DUMMY_ARTISTS}
          handleSelectArtist={handleSelectArtist}
        />
      )}

      {currentView === "artist-page" && (
        <ArtistPage 
          setCurrentView={setCurrentView}
          selectedArtist={selectedArtist}
          handleStartBracket={handleStartBracket}
        />
      )}

      {currentView === "bracket" && (
        <BracketPage 
          handleReset={handleReset}
          selectedArtist={selectedArtist}
          bracketSongs={bracketSongs}
        />
      )}
    </main>
  )
}

export default App
