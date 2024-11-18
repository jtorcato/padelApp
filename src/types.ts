export interface Player {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  date: string;
  team1: {
    players: [Player, Player];
    score: number;
  };
  team2: {
    players: [Player, Player];
    score: number;
  };
  duration: number; // in minutes
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  totalPoints: number;
}