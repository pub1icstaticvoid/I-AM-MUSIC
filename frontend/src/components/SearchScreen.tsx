import { useNavigate } from "react-router-dom";
import type { Artist } from "../types";

interface SearchScreenProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: React.SubmitEvent) => void;
    searchResults: Artist[];
    setSelectedArtist: (artist: Artist) => void;
}

export default function SearchScreen({
    searchQuery,
    setSearchQuery,
    handleSearch,
    searchResults,
    setSelectedArtist,
}: SearchScreenProps) {
    const navigate = useNavigate();

    const onSelectArtist = (artist: Artist) => {
        setSelectedArtist(artist);
        navigate(`/artist/${encodeURIComponent(artist.name)}`);
    };

    return (
        <div className='view-container'>
            <h1>Find an Artist</h1>
            <form onSubmit={handleSearch}>
                <input 
                    type='text'
                    placeholder='Type an artist name...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type='submit'>
                    Search
                </button>
            </form>

            <div className='results-list'>
                {searchResults.length > 0 && <h3>Search Results:</h3>}

                {searchResults.map((artist, index) => (
                    <button
                        key={artist.id || index}
                        onClick={() => onSelectArtist(artist)}
                        className="artist-result-btn"
                    >
                        {artist.imageUrl && (
                            <img
                                src={artist.imageUrl}
                                alt={`${artist.name} profile`}
                                className="artist-thumbnail"
                            />
                        )}
                        <span>{artist.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}