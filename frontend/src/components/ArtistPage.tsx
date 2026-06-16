import type { ViewState } from "../App";
import type { Artist } from "../types";

interface ArtistPageProps {
    setCurrentView: (screen: ViewState) => void;
    selectedArtist: Artist | null;
    handleStartBracket: () => void;
}

export default function ArtistPage({
    setCurrentView,
    selectedArtist,
    handleStartBracket
}: ArtistPageProps) {
    return (
        <div className='view-container'>
            <button onClick={() => setCurrentView("search")}>&larr; Back to Search</button>
            <h2>{selectedArtist?.name}</h2>
            <p>Select an option:</p>

            <div className='options-grid'>
                <button
                    onClick={handleStartBracket}
                >
                    Madness Bracket
                </button>
                <button disabled>
                    More options coming soon...
                </button>
            </div>
        </div>
    );
}