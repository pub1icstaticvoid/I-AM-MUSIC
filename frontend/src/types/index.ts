export interface Track {
    id: string;
    name: string;
    albumArt?: string;
}

export interface Match {
    id: string; // e.g. "r0-m0" for round 0 match 0
    sides: [Track | null, Track | null];
    winnerId?: string;
}

export interface Round {
    title: string;
    seeds: Match[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Track {
  id: string;
  name: string;
  imageUrl?: string;
}