import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bracket, Seed, SeedItem, SeedTeam, type IRenderSeedProps } from "react-brackets";
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
    const [rounds, setRounds] = useState<any[]>([]);

    useEffect(() => {
        if (bracketSongs.length === 8) {
            setRounds([
                {
                    title: "Quarterfinals",
                    seeds: [
                        { id: 1, teams: [{ name: bracketSongs[0].name }, {name: bracketSongs[1].name }] },
                        { id: 2, teams: [{ name: bracketSongs[2].name }, {name: bracketSongs[3].name }] },
                        { id: 3, teams: [{ name: bracketSongs[4].name }, {name: bracketSongs[5].name }] },
                        { id: 4, teams: [{ name: bracketSongs[6].name }, {name: bracketSongs[7].name }] },
                    ],
                },
                {
                    title: "Semifinals",
                    seeds: [
                        { id: 5, teams: [{ name: "?" }, {name: "?" }] },
                        { id: 6, teams: [{ name: "?" }, {name: "?" }] },
                    ],
                },
                {
                    title: "Finals",
                    seeds: [
                        { id: 7, teams: [{ name: "?" }, {name: "?" }] },
                    ],
                },
                {
                    title: "Winner",
                    seeds: [
                        { id: 8, teams: [{ name: "?" }] },
                    ],
                }
            ]);
        }
    }, [bracketSongs]);

    const onStartOver = () => {
        resetState();
        navigate("/");
    };

    const advanceSong = (songName: string, currentRoundIndex: number, currentSeedIndex: number) => {
        if (songName === "?") return;

        const nextRoundIndex = currentRoundIndex + 1;
        if (nextRoundIndex >= rounds.length) return;

        const nextSeedIndex = Math.floor(currentSeedIndex / 2);
        const nextTeamIndex = currentSeedIndex % 2;

        const newRounds = [...rounds];

        newRounds[nextRoundIndex].seeds[nextSeedIndex].teams[nextTeamIndex].name = songName;

        setRounds(newRounds);
    };

    const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex}: IRenderSeedProps) => {
        return (
            <Seed mobileBreakPoint={breakpoint}>
                <SeedItem>
                    <div>
                        <SeedTeam
                            onClick={() => advanceSong(seed.teams[0]?.name || "?", roundIndex, seedIndex)}
                        >
                            {seed.teams[0]?.name || "?"}
                        </SeedTeam>

                        {seed.teams[1] && (
                            <SeedTeam
                                onClick={() => advanceSong(seed.teams[1]?.name || "?", roundIndex, seedIndex)}
                            >
                                {seed.teams[1]?.name || "?"}
                            </SeedTeam>
                        )}
                    </div>
                </SeedItem>
            </Seed>
        );
    };

    if (bracketSongs.length < 8) {
        return <div className='view-container'><h2>Loading Bracket...</h2></div>
    }

    return (
        <div className='view-container'>
            <button onClick={onStartOver}>Start Over</button>
            <h2>{selectedArtist?.name} - Madness Bracket</h2>

            <div>
                <Bracket 
                    rounds={rounds}
                    renderSeedComponent={(props) => <CustomSeed {...props} />}
                />
            </div>
        </div>
    );
}