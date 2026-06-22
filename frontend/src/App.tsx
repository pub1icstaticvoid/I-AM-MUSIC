import { useState } from 'react';
import type { Artist, Track } from './types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { filterTracks, removeDupes } from './utils/trackFilters';
import SearchScreen from './components/SearchScreen';
import ArtistPage from './components/ArtistPage';
import BracketPage from './components/BracketPage';
import './App.css';

const DUMMY_ARTISTS: Artist[] = [
  { id: "1", name: "Joji" },
  { id: "2", name: "JPEGMAFIA" },
  { id: "3", name: "clipping." },
  { id: "4", name: "Death Grips" },
  { id: "5", name: "Injury Reserve" },
  { id: "6", name: "Kanye West" }
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
    const limit = 20;
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=${limit}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.topalbums || !data.topalbums.album) return [];

      let topAlbums = data.topalbums.album;

      const maxPlaycount = parseInt(topAlbums[0].playcount, 10);

      const dynamicThreshold = maxPlaycount * 0.001;
      const popularityThreshold = Math.max(dynamicThreshold, 1000);

      topAlbums = topAlbums.filter((album: any) => {
        const playcount = parseInt(album.playcount, 10);
        return playcount >= popularityThreshold;
      });

      const trackPromises = topAlbums.map(async (album: any) => {
        const albumUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(album.name)}&api_key=${API_KEY}&format=json`;
        const res = await fetch(albumUrl);
        const albumData = await res.json();
        return albumData.album;
      });

      const detailedAlbums = await Promise.all(trackPromises);

      let allTracks: Track[] = [];

      detailedAlbums.forEach((album) => {
        if (!album || !album.tracks || !album.tracks.track) return;

        const tracks = Array.isArray(album.tracks.track)
          ? album.tracks.track
          : [album.tracks.track];

        if (tracks.length >= 5) {
          allTracks = [...allTracks, ...tracks];
        }
      });

      const tracks = removeDupes(filterTracks(allTracks));

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