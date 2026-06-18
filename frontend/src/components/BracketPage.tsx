import { useNavigate } from "react-router-dom";
import type { Artist, Track } from "../types";

interface BracketPageProps {
    resetState: () => void;
    selectedArtist: Artist | null;
    bracketSongs: Track[];
}

export default function BracketPage({
    resetState,
    selectedArtist,
    bracketSongs, 
}: BracketPageProps) {
    const navigate = useNavigate();

    const onStartOver = () => {
        resetState();
        navigate("/");
    };

    return (
        <div className='view-container'>
            <button onClick={onStartOver}>Start Over</button>
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