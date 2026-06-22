import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bracket, Seed, SeedItem, SeedTeam, type IRenderSeedProps } from "react-brackets";
import type { Artist, Track } from "../types";

interface BracketPageProps {
    resetState: () => void;
    selectedArtist: Artist | null;
    bracketSongs: Track[];
}

interface CustomSeedProps extends IRenderSeedProps {
    side: "left" | "right" | "finals";
}

export default function BracketPage({
    resetState,
    selectedArtist,
    bracketSongs, 
}: BracketPageProps) {
    const navigate = useNavigate();

    const [leftRounds, setLeftRounds] = useState<any[]>([]);
    const [rightRounds, setRightRounds] = useState<any[]>([]);
    const [finalRounds, setFinalRounds] = useState<any[]>([]);
    const [champion, setChampion] = useState<string | null>(null);

    useEffect(() => {
        if (bracketSongs.length === 16) {
            setLeftRounds([
                {
                    title: "Round of 16",
                    seeds: [
                        { id: 1, teams: [{ name: bracketSongs[0].name }, {name: bracketSongs[1].name }] },
                        { id: 2, teams: [{ name: bracketSongs[2].name }, {name: bracketSongs[3].name }] },
                        { id: 3, teams: [{ name: bracketSongs[4].name }, {name: bracketSongs[5].name }] },
                        { id: 4, teams: [{ name: bracketSongs[6].name }, {name: bracketSongs[7].name }] },
                    ],
                },
                {
                    title: "Quarterfinals",
                    seeds: [
                        { id: 5, teams: [{ name: "?" }, {name: "?" }] },
                        { id: 6, teams: [{ name: "?" }, {name: "?" }] },
                    ],
                },
                {
                    title: "Semifinals",
                    seeds: [
                        { id: 7, teams: [{ name: "?" }, {name: "?" }] },
                    ],
                },
            ]);

            setRightRounds([
                {
                    title: "Round of 16",
                    seeds: [
                        { id: 8, teams: [{ name: bracketSongs[8].name }, {name: bracketSongs[9].name }] },
                        { id: 9, teams: [{ name: bracketSongs[10].name }, {name: bracketSongs[11].name }] },
                        { id: 10, teams: [{ name: bracketSongs[12].name }, {name: bracketSongs[13].name }] },
                        { id: 11, teams: [{ name: bracketSongs[14].name }, {name: bracketSongs[15].name }] },
                    ],
                },
                {
                    title: "Quarterfinals",
                    seeds: [
                        { id: 12, teams: [{ name: "?" }, {name: "?" }] },
                        { id: 13, teams: [{ name: "?" }, {name: "?" }] },
                    ],
                },
                {
                    title: "Semifinals",
                    seeds: [
                        { id: 14, teams: [{ name: "?" }, {name: "?" }] },
                    ],
                },
            ]);

            setFinalRounds([
                {
                    title: "Finals",
                    seeds: [
                        { id: 15, teams: [{ name: "?"}, { name: "?" }] },
                    ],
                },
            ]);

            setChampion(null);
        }
    }, [bracketSongs]);

    const onStartOver = () => {
        resetState();
        navigate("/");
    };

    const advanceSong = (
        songName: string, 
        roundIndex: number, 
        seedIndex: number,
        side: "left" | "right" | "finals"
    ) => {
        if (songName === "?") return;

        if (side === "left") {
            if (roundIndex < 2) {
                const newRounds = [...leftRounds];
                const nextSeedIndex = Math.floor(seedIndex / 2);
                const nextTeamIndex = seedIndex % 2;
                newRounds[roundIndex + 1].seeds[nextSeedIndex].teams[nextTeamIndex].name = songName;
                setLeftRounds(newRounds);
            }
            else if (roundIndex === 2) {
                const newFinals = [...finalRounds];
                newFinals[0].seeds[0].teams[0].name = songName;
                setFinalRounds(newFinals);
            }
        }
        else if (side === "right") {
            if (roundIndex < 2) {
                const newRounds = [...rightRounds];
                const nextSeedIndex = Math.floor(seedIndex / 2);
                const nextTeamIndex = seedIndex % 2;
                newRounds[roundIndex + 1].seeds[nextSeedIndex].teams[nextTeamIndex].name = songName;
                setRightRounds(newRounds);
            }
            else if (roundIndex === 2) {
                const newFinals = [...finalRounds];
                newFinals[0].seeds[0].teams[1].name = songName;
                setFinalRounds(newFinals);
            }
        }
        else if (side === "finals") {
            setChampion(songName);
        }
    };

    const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex, side}: CustomSeedProps) => {
        const textMirrorFix = side === "right" ? "scaleX(-1)" : "none";

        return (
            <Seed mobileBreakPoint={breakpoint}>
                <SeedItem>
                    <div style={{ transform: textMirrorFix }}>
                        <SeedTeam
                            onClick={() => advanceSong(seed.teams[0]?.name || "?", roundIndex, seedIndex, side)}
                        >
                            {seed.teams[0]?.name || "?"}
                        </SeedTeam>

                        {seed.teams[1] && (
                            <SeedTeam
                                onClick={() => advanceSong(seed.teams[1]?.name || "?", roundIndex, seedIndex, side)}
                            >
                                {seed.teams[1]?.name || "?"}
                            </SeedTeam>
                        )}
                    </div>
                </SeedItem>
            </Seed>
        );
    };

    if (bracketSongs.length < 16) {
        return (
            <div className='view-container'>
                <h2>Loading Bracket...</h2>
            </div>
        );
    }

    return (
        <div className='view-container'>
            <button onClick={onStartOver}>Start Over</button>
            <h2>{selectedArtist?.name} - Madness Bracket</h2>

            <div className="bracket-layout">

                <div className="bracket">
                    <Bracket 
                        rounds={leftRounds}
                        renderSeedComponent={(props) => <CustomSeed {...props} side="left" />}
                    />
                </div>

                <div className="bracket" style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "200px" }}>
                    {champion ? (
                        <div>
                            <h3>Winner</h3>
                            <h2>{champion}</h2>
                        </div>
                    ) : (
                        <div style={{ height: "100px"}}>
                            <h3>Winner</h3>
                        </div>
                    )}

                    <Bracket
                        rounds={finalRounds}
                        renderSeedComponent={(props) => <CustomSeed {...props} side="finals" />}
                    />
                </div>

                <div className="bracket" style={{ transform: "scaleX(-1)" }}>
                    <Bracket
                        rounds={rightRounds}
                        renderSeedComponent={(props) => <CustomSeed {...props} side="right" />}
                        roundTitleComponent={(title: React.ReactNode) => (
                            <div style={{ textAlign: "center", transform: "scaleX(-1)" }}>
                                {title}
                            </div>
                        )}
                    />
                </div>

            </div>
        </div>
    );
}