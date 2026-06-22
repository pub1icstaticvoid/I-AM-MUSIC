import type { Track } from "../types";

const FILTER_KEYWORDS = [
    "(live)",
    "live at",
    "- live ver.",
    "session",
    "album",
    "concert",
    "at the",
    "visual",
    "music video",
    "official video",
    "full ep",
    "instrumental",
    "review",
    "slowed",
    "reverb",
    "sped up",
    "mashup"
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
        const cleanText = track.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // 1. DUPLICATE CHECKER
        const normalizedName = cleanText
            .toLowerCase()
            // NEW: Strips out (Artist/Album) tags
            .replace(/\s*\([^)]*\/[^)]*\)/g, "") 
            .replace(/\s*[\(\[][^\)\]]*(remaster|deluxe|live|edit|version|acoustic|instrumental|mix|demo|offline|explicit|clean|official|video|audio|visual|feat|ft\.|featuring|with)[^\)\]]*[\)\]]/gi, "")
            .replace(/\s*-.*(?:remaster|deluxe|live|edit|version|acoustic|instrumental|mix|demo|offline|explicit|clean|official|video|audio|visual|feat|ft\.|featuring|with).*/gi, "")
            .trim();

        if (seenNames.has(normalizedName)) return false;
        
        seenNames.add(normalizedName);

        // 2. VISUAL FIX
        track.name = cleanText
            // NEW: Strips out (Artist/Album) from your Bracket UI!
            .replace(/\s*\([^)]*\/[^)]*\)/g, "") 
            .replace(/\s*[\(\[][^\)\]]*(remaster|deluxe|live|edit|version|acoustic|instrumental|mix|demo|offline|explicit|clean|official|video|audio|visual|slowed|reverb|sped up)[^\)\]]*[\)\]]/gi, "")
            .replace(/\s*-.*(?:remaster|deluxe|live|edit|version|acoustic|instrumental|mix|demo|offline|explicit|clean|official|video|audio|visual|slowed|reverb|sped up).*/gi, "")
            .trim();

        return true;
    });
};