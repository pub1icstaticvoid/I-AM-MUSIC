import type { Track } from "../types";

const FILTER_KEYWORDS = [
    "(live)",
    "live at",
    "- live ver.",
    "instrumental",
];

export const filterTracks = (tracks: Track[]): Track[] => {
    return tracks.filter((track) => {
        const name = track.name.toLowerCase();
        return !FILTER_KEYWORDS.some((keyword) => name.includes(keyword));
    });
};

export const removeDupes = (tracks: Track[]): Track[] => {
    const seenNames = new Set<string>();

    return tracks.filter((track) => {
        const normalizedName = track.name
            .toLowerCase()
            .replace(/\s*\([^)]*\)/g, "")
            .replace(/- remaster|remastered|deluxe/g, "")
            .trim();


        if (seenNames.has(normalizedName)) return false;
        seenNames.add(normalizedName);
        return true;
    });
};