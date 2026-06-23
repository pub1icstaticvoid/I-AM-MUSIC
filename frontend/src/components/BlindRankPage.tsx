import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./BlindRankPage.css";
import type { Artist, Track } from "../types";

interface BlindRankPageProps {
    resetState: () => void;
    selectedArtist: Artist | null;
    blindRankSongs: Track[];
}

export default function BlindRankPage({ resetState, selectedArtist, blindRankSongs }: BlindRankPageProps) {
    const { artistName } = useParams();

    const [slots, setSlots] = useState<(Track | null)[]>(Array(10).fill(null));
    const [currentSong, setCurrentSong] = useState<Track | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const isFinished = slots.every(slot => slot !== null);

    useEffect(() => {
        if (blindRankSongs.length > 0 && !currentSong && !isFinished) pickRandomSong();
    }, [blindRankSongs]);

    const pickRandomSong = () => {
        const usedSongIds = slots.filter(s => s !== null).map(s => s?.id);

        const availableSongs = blindRankSongs.filter(
            song => !usedSongIds.includes(song.id) && song.id !== currentSong?.id
        );

        if (availableSongs.length === 0) {
            setCurrentSong(null);
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        setCurrentSong(availableSongs[randomIndex]);
    };

    const handleReroll = () => {
        if (!isFinished) pickRandomSong();
    };

    const handleSlotClick = (index: number) => {
        if (!currentSong || isFinished) return;

        const newSlots = [...slots];
        newSlots[index] = currentSong;
        setSlots(newSlots);
        pickRandomSong();
    };

    const handleDragStart = (index: number) => {
        if (slots[index]) setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newSlots = [...slots];
        const temp = newSlots[draggedIndex];
        newSlots[draggedIndex] = newSlots[dropIndex];
        newSlots[dropIndex] = temp;

        setSlots(newSlots);
        setDraggedIndex(null);
    };

    return (
        <div className="view-container">
            <div className="back-buttons-div">
                <Link to={`/artist/${encodeURIComponent(artistName || "")}`} className="back-button">
                    &larr; Back to Artist Options
                </Link>

                <Link to="/" onClick={resetState} className="back-button">
                    &larr; Start Over
                </Link>
            </div>

            <h2>
                Blind Ranking: {selectedArtist?.name || artistName}
            </h2>

            <div className="current-song-section" style={{ marginBottom: "2rem", textAlign: "center" }}>
                {isFinished? (
                    <h3>
                        Ranking Complete
                    </h3>
                ) : currentSong ? (
                    <div 
                        className="active-song-card"
                        onClick={handleReroll}
                    >
                        <img 
                            className="card-img"
                            src={currentSong?.imageUrl || ""}
                            alt={currentSong?.name}
                        />
                        <h3>
                            {currentSong?.name}
                        </h3>
                    </div>
                ) : (
                    <p>
                        Loading songs...
                    </p>
                )}
            </div>

            <div className="ranking-slots">
                {slots.map((track, index) => (
                    <div
                        className="slot"
                        key={index}
                        onClick={() => handleSlotClick(index)}
                        draggable={!!track}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => {handleDrop(e, index)}}
                        style={{
                            cursor: track ? "grab" : "pointer",
                            backgroundColor: track ? "#222" : "transparent",
                        }}
                    >
                        <span className="index">
                            {index + 1}
                        </span>
                        {track ? (
                            <>
                                <img
                                    className="ranking-img"
                                    src={track.imageUrl || ""}
                                    alt={track.name}
                                />
                                <span>
                                    {track.name}
                                </span>
                            </>
                        ) : (
                            <span></span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}