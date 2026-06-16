import type { Artist } from "../types";

interface SearchScreenProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: React.SubmitEvent) => void;
    dummyArtists: Artist[];
    handleSelectArtist: (artist: Artist) => void;
}

export default function SearchScreen({
    searchQuery,
    setSearchQuery,
    handleSearch,
    dummyArtists,
    handleSelectArtist,
}: SearchScreenProps) {
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
                <h3>Dummy results:</h3>
                {dummyArtists.map((artist) => (
                <button
                    key={artist.id}
                    onClick={() => handleSelectArtist(artist)}
                >
                    {artist.name}
                </button>
                ))}
            </div>
        </div>
    );
}