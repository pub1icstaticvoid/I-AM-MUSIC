import { useNavigate, useParams, Link } from "react-router-dom";
import type { Artist } from "../types";

interface ArtistPageProps {
    selectedArtist: Artist | null;
    handleStartBracket: (artistName: string) => void;
    handleStartBlindRank: (artistName: string) => void;
    handleStartSoundsLike: (artistName: string) => void;
}

export default function ArtistPage({
    selectedArtist,
    handleStartBracket,
    handleStartBlindRank,
    handleStartSoundsLike
}: ArtistPageProps) {
    const navigate = useNavigate();
    const { artistName } = useParams();

    const onStartBracket = () => {
        const targetArtist = artistName || selectedArtist?.name || "";
        handleStartBracket(targetArtist);
        navigate(`/bracket/${encodeURIComponent(targetArtist)}`);
    };

    const onStartBlindRank = () => {
        const targetArtist = artistName || selectedArtist?.name || "";
        handleStartBlindRank(targetArtist);
        navigate(`/blind-rank/${encodeURIComponent(targetArtist)}`);
    };

    const onStartSoundsLike = () => {
        const targetArtist = artistName || selectedArtist?.name || "name";
        handleStartSoundsLike(targetArtist);
        navigate(`/sounds-like/${encodeURIComponent(targetArtist)}`)
    }

    return (
        <div className='view-container'>
            <Link to="/" className="back-button">&larr; Back to Search</Link>

            <h2>{selectedArtist?.name || artistName}</h2>
            <p>Select an option:</p>

            <div className='options-grid'>
                <button onClick={onStartBracket}>
                    Madness Bracket
                </button>

                <button onClick={onStartBlindRank}>
                    Blind Ranking
                </button>

                <button onClick={onStartSoundsLike}>
                    It's On, Sounds Like Grid
                </button>

                <button disabled>
                    More options coming soon...
                </button>
            </div>
        </div>
    );
}