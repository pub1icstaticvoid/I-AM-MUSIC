import type { Artist, Track } from "../types";

interface BracketPageProps {
    handleReset: () => void;
    selectedArtist: Artist | null;
    bracketSongs: Track[];
}

export default function BracketPage({
    handleReset,
    selectedArtist,
    bracketSongs, 
}: BracketPageProps) {
    return (
        <div className='view-container'>
            <button onClick={handleReset}>Start Over</button>
            <h2>{selectedArtist?.name} - Madness Bracket</h2>

            <div className='bracket-placeholder'>
                <h3>Selected Tracks for this Bracket:</h3>
                <ul>
                    {bracketSongs.map((song) => (
                        <li key={song.id}>{song.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}