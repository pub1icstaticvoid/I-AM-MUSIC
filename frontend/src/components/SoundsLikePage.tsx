import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Artist, Track, Album } from "../types";

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
        <div className="game-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{selectedArtist?.name || artistName}: Is On/Sounds Like Grid</h2>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to={`/artist/${encodeURIComponent(artistName || "")}`} className="back-button">
                        &larr; Back to Artist Options
                    </Link>

                    <Link to="/" onClick={resetState} className="back-button">
                        &larr; Start Over
                    </Link>
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '120px repeat(5, 160px)',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <div />

                {randomAlbums.map((album) => (
                    <div key={`col-${album.id}`} style={{ textAlign: 'center', padding: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                        <img src={album.imageUrl} alt={album.name} style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{album.name}</div>
                        <span style={{ color: '#00ffcc', fontSize: '10px' }}>(Sounds Like)</span>
                    </div>
                ))}

                {randomAlbums.map((rowAlbum, rowIndex) => (
                    <div key={`row-group-${rowAlbum.id}`} style={{ display: 'contents' }}>
                        <div style={{ padding: '5px', fontSize: '12px', fontWeight: 'bold', borderRight: '2px solid #444' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{rowAlbum.name}</div>
                            <span style={{ color: '#ff007f', fontSize: '10px' }}>(Is On)</span>
                        </div>

                        {randomAlbums.map((_, colIndex) => {
                            const slotIndex = rowIndex * 5 + colIndex;
                            const filledTrack = slots[slotIndex];

                            return (
                                <button
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    onClick={() => handleSlotClick(rowIndex, colIndex)}
                                    style={{
                                        aspectRatio: '1/1',
                                        backgroundColor: filledTrack ? '#222' : '#333',
                                        border: activeSlot?.rowIndex === rowIndex && activeSlot?.colIndex === colIndex ? '2px solid #00ffcc' : '1px solid #555',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '8px',
                                        fontSize: '11px',
                                        transition: 'transform 0.1s'
                                    }}
                                >
                                    {filledTrack ? (
                                        <>
                                            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>{filledTrack.name}</span>
                                            <span style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>From: {filledTrack.albumName}</span>
                                        </>
                                    ) : (
                                        <span style={{ color: '#aaa' }}>Select Song</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {activeSlot !== null && (
                <div
                    onClick={() => setActiveSlot(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        zIndex: 999
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            left: 'auto',
                            top: 'auto',
                            transform: 'none',
                            zIndex: 1000,
                            background: '#222',
                            border: '1px solid #444',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            width: '90%',
                            maxWidth: '400px'
                    }}>
                        <h3>
                            Pick a song that's from <span style={{ color: '#00ffcc' }}>{randomAlbums[activeSlot.rowIndex].name}</span>, <br />
                            that sounds like it's from <span style={{ color: '#ff007f' }}>{randomAlbums[activeSlot?.colIndex].name}</span>:
                        </h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px', maxHeight: '200px', overflowY: 'auto', padding: '5px' }}>
                            {filterAlbumSongs.length === 0 ? (
                                <p style={{ color: '#aaa' }}>No songs found for this album.</p>
                            ) : (
                                filterAlbumSongs.map((track) => (
                                    <button
                                        key={track.id}
                                        onClick={() => handleSelectSong(track)}
                                        style={{
                                            padding: '8px 12px',
                                            background: '#444',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {track.name}
                                    </button>
                                ))
                            )}
                        </div>
                        <button
                            onClick={() => setActiveSlot(null)}
                            style={{ marginTop: '15px', padding: '6px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}