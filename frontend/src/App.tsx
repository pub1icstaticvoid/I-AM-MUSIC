import { useState } from 'react';
import type { Artist, Track, Album } from './types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { filterTracks, removeDupes } from './utils/trackFilters';
import SearchScreen from './components/SearchScreen';
import ArtistPage from './components/ArtistPage';
import BracketPage from './components/BracketPage';
import BlindRankPage from './components/BlindRankPage';
import SoundsLikePage from './components/SoundsLikePage';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [selectedArtist, setselectedArtist] = useState<Artist | null>(null);
  const [bracketSongs, setBracketSongs] = useState<Track[]>([]);
  const [blindRankSongs, setBlindRankSongs] = useState<Track[]>([]);
  const [gridAlbums, setGridAlbums] = useState<Album[]>([]);
  const [gridTracks, setGridTracks] = useState<Track[]>([]);

  const handleSearch = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const API_KEY = import.meta.env.VITE_API_KEY;
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(searchQuery)}&api_key=${API_KEY}&format=json&limit=10`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const artists = data.results?.artistmatches?.artist;
      if (!artists) return;

      const formattedResults: Artist[] = artists.map((a: any) => {
        const imageObj = a.image?.find((img: any) => img.size === "extralarge") || a.image?.[a.image.length - 1];

        return {
          id: a.mbid || a.name,
          name: a.name,
          imageUrl: imageObj?.["#text"] || ""
        };
      });

      setSearchResults(formattedResults);
    }
    catch (error) {
      console.error("failed to search last.fm:", error);
    }
  };

  const handleStartBracket = async (artistName: string) => {
    const tracks = await fetchArtistTracks(artistName, 16);

    setBracketSongs(tracks);
  };

  const handleStartBlindRank = async (artistName: string) => {
    const tracks = await fetchArtistTracks(artistName, Infinity);

    setBlindRankSongs(tracks);
  };

  const handleStartSoundsLike = async (artistName: string) => {
    const [albums, tracks] = await Promise.all([
      fetchArtistAlbums(artistName),
      fetchArtistTracks(artistName, Infinity)
    ])

    setGridAlbums(albums);
    setGridTracks(tracks);
  }

  const resetState = () => {
    setSearchQuery("");
    setselectedArtist(null);
    setBracketSongs([]);
    setBlindRankSongs([]);
    setGridAlbums([]);
    setGridTracks([]);
  };

  const fetchArtistAlbums = async (artistName: string, limit: number = 25) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=${limit}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.topalbums || !data.topalbums.album) return [];

      const formattedAlbums: Album[] = data.topalbums.album.map((album: any) => {
        const imageObj = album.image?.find((img: any) => img.size === 'extralarge') || album.image?.[album.image.length - 1];

        return {
          id: album.mbid || album.name,
          name: album.name,
          imageUrl: imageObj?.['#text'] || ''
        };
      });

      return formattedAlbums;
    }
    catch (error) {
      console.error("Failed to fetch albums: ", error);
      return [];
    }
  }

  const fetchArtistTracks = async (artistName: string, count: number = 16) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const limit = 25;
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=${limit}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.topalbums || !data.topalbums.album) return [];

      let topAlbums = data.topalbums.album;

      const maxPlaycount = parseInt(topAlbums[0].playcount, 10);

      const dynamicThreshold = maxPlaycount * 0.05;
      const popularityThreshold = Math.max(dynamicThreshold, 200);

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

        const albumImageObj = album.image?.find((img: any) => img.size === "extralarge") || album.image?.[album.image.length - 1];
        const albumImageUrl = albumImageObj?.["#text"] || "";

        const tracks = Array.isArray(album.tracks.track)
          ? album.tracks.track
          : [album.tracks.track];

        const formattedTracks: Track[] = tracks.map((t: any) => ({
          id: t.url || t.name,
          name: t.name,
          imageUrl: albumImageUrl,
          albumName: album.name
        }));

        if (tracks.length >= 5) {
          allTracks = [...allTracks, ...formattedTracks];
        }
      });

      const tracks = removeDupes(filterTracks(allTracks));

      const shuffled = [...tracks].sort(() => 0.5 - Math.random());
      const selectedForBracket = shuffled.slice(0, count);

      return selectedForBracket;
    }
    catch (error) {
      console.error("failed to fetch tracks: ", error);
      return [];
    }
  }

  return (
    <>
      <header
        style={{ 
          borderBottom: "5px solid var(--border)",
          padding: "10px"
         }}
      >
        <h1>Sorted</h1>
      </header>

      <BrowserRouter>
        <Routes>
          <Route 
            path='/' 
            element={<SearchScreen 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              searchResults={searchResults}
              setSelectedArtist={setselectedArtist}
            />}
          />

          <Route 
            path='/artist/:artistName'
            element={<ArtistPage 
              selectedArtist={selectedArtist}
              handleStartBracket={handleStartBracket}
              handleStartBlindRank={handleStartBlindRank}
              handleStartSoundsLike={handleStartSoundsLike}
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

          <Route
            path='/blind-rank/:artistName'
            element={<BlindRankPage 
              resetState={resetState}
              selectedArtist={selectedArtist}
              blindRankSongs={blindRankSongs}
            />}
          />
          <Route
            path='/sounds-like/:artistName'
            element={<SoundsLikePage
              resetState={resetState}
              selectedArtist={selectedArtist}
              gridAlbums={gridAlbums}
              gridTracks={gridTracks}
            />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App