import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Artist, Track, Album } from "../types";
import "./SoundsLikePage.css";

interface SoundsLikePageProps {
    resetState: () => void;
    selectedArtist: Artist | null;
    gridAlbums: Album[];
    gridTracks: Track[];
}

export default function SoundsLikePage({ resetState, selectedArtist, gridAlbums, gridTracks }: SoundsLikePageProps) {
    const { artistName } = useParams();
    const [slots, setSlots] = useState<(Track | null)[]>(Array(25).fill(null));
    const [activeSlot, setActiveSlot] = useState<{ rowIndex: number, colIndex: number } | null>(null);

    const randomAlbums = useMemo(() => {
        if (!gridAlbums || gridAlbums.length === 0) return [];

        const fullLengthALbums = gridAlbums.filter(album => {
            const trackCount = gridTracks.filter(track => track.albumName === album.name).length;
            return trackCount >= 4;
        });

        const allAlbums = fullLengthALbums.length >= 5 ? fullLengthALbums : gridAlbums;

        const ranAlbums = [...allAlbums].sort(() => 0.5 - Math.random());
        return ranAlbums.slice(0, 5);
    }, [gridAlbums, gridTracks]);

    const handleSlotClick = (rowIndex: number, colIndex: number) => {
        setActiveSlot({ rowIndex, colIndex });
    }

    const handleSelectSong = (track: Track) => {
        if (!activeSlot) return;

        const { rowIndex, colIndex } = activeSlot;
        const slotIndex = rowIndex * 5 + colIndex;

        const updatedSlots = [...slots];
        updatedSlots[slotIndex] = track;

        setSlots(updatedSlots);
        setActiveSlot(null);
    }

    const filterAlbumSongs = useMemo(() => {
        if (!activeSlot || !randomAlbums[activeSlot.rowIndex]) return [];
        const targetAlbumName = randomAlbums[activeSlot.rowIndex].name;

        return gridTracks.filter(tracks => tracks.albumName === targetAlbumName);
    }, [activeSlot, randomAlbums, gridTracks]);

    if (randomAlbums.length < 5) {
        return <div className="loading">Loading albums...</div>;
    }
    
    return (
        <div className="game-container">
            <header className="game-header">
                <h2>{selectedArtist?.name || artistName}: Is On/Sounds Like Grid</h2>
                <div className="game-header-actions">
                    <Link to={`/artist/${encodeURIComponent(artistName || "")}`} className="back-button">
                        &larr; Back to Artist Options
                    </Link>

                    <Link to="/" onClick={resetState} className="back-button">
                        &larr; Start Over
                    </Link>
                </div>
            </header>

            <div className="grid-board">
                <div />

                {randomAlbums.map((album) => (
                    <div key={`col-${album.id}`} className="col-header">
                        <img src={album.imageUrl} alt={album.name} />
                        <div className="header-text">{album.name}</div>
                        <span className="col-label">(Sounds Like)</span>
                    </div>
                ))}

                {randomAlbums.map((rowAlbum, rowIndex) => (
                    <div key={`row-group-${rowAlbum.id}`} style={{ display: 'contents' }}>
                        <div className="row-header">
                            <img src={rowAlbum.imageUrl} alt={rowAlbum.name} />
                            <div className="header-text">{rowAlbum.name}</div>
                            <span className="row-label">(Is On)</span>
                        </div>

                        {randomAlbums.map((_, colIndex) => {
                            const slotIndex = rowIndex * 5 + colIndex;
                            const filledTrack = slots[slotIndex];

                            const isActive = activeSlot?.rowIndex === rowIndex && activeSlot?.colIndex === colIndex;
                            let cellClass = "grid-cell";
                            if (isActive) cellClass += " active";
                            if (filledTrack) cellClass += " filled";

                            return (
                                <button
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    onClick={() => handleSlotClick(rowIndex, colIndex)}
                                    className={cellClass}
                                >
                                    {filledTrack ? (
                                        <>
                                            <span className="cell-track-name">{filledTrack.name}</span>
                                            <span className="cell-album-name">From: {filledTrack.albumName}</span>
                                        </>
                                    ) : (
                                        <span className="cell-empty">Select Song</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {activeSlot !== null && (
                <div className="modal-overlay" onClick={() => setActiveSlot(null)}>
                    <div
                        className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>
                            Pick a song that's from <span className="highlight-col">{randomAlbums[activeSlot.rowIndex].name}</span>, <br />
                            that sounds like it's from <span className="highlight-row">{randomAlbums[activeSlot?.colIndex].name}</span>:
                        </h3>

                        <div className="song-list">
                            {filterAlbumSongs.length === 0 ? (
                                <p className="cell-empty">No songs found for this album.</p>
                            ) : (
                                filterAlbumSongs.map((track) => (
                                    <button
                                        key={track.id}
                                        onClick={() => handleSelectSong(track)}
                                        className="song-btn"
                                    >
                                        {track.name}
                                    </button>
                                ))
                            )}
                        </div>
                        <button className="cancel-btn" onClick={() => setActiveSlot(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}