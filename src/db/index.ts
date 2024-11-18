import Database from 'better-sqlite3';
import { Game, Player } from '../types';

const db = new Database('padel.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    team1_score INTEGER NOT NULL,
    team2_score INTEGER NOT NULL,
    duration INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS game_players (
    game_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    team INTEGER NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    PRIMARY KEY (game_id, player_id)
  );
`);

export function saveGame(game: Omit<Game, 'id'>): Game {
  const gameId = crypto.randomUUID();
  
  const insertPlayer = db.prepare('INSERT OR IGNORE INTO players (id, name) VALUES (?, ?)');
  const insertGame = db.prepare('INSERT INTO games (id, date, team1_score, team2_score, duration) VALUES (?, ?, ?, ?, ?)');
  const insertGamePlayer = db.prepare('INSERT INTO game_players (game_id, player_id, team) VALUES (?, ?, ?)');

  db.transaction(() => {
    // Insert players
    [...game.team1.players, ...game.team2.players].forEach(player => {
      insertPlayer.run(player.id, player.name);
    });

    // Insert game
    insertGame.run(
      gameId,
      game.date,
      game.team1.score,
      game.team2.score,
      game.duration
    );

    // Insert player associations
    game.team1.players.forEach(player => {
      insertGamePlayer.run(gameId, player.id, 1);
    });
    game.team2.players.forEach(player => {
      insertGamePlayer.run(gameId, player.id, 2);
    });
  })();

  return {
    id: gameId,
    ...game
  };
}

export function loadGames(): Game[] {
  const games = db.prepare(`
    SELECT 
      g.id,
      g.date,
      g.team1_score,
      g.team2_score,
      g.duration,
      GROUP_CONCAT(CASE 
        WHEN gp.team = 1 THEN json_object('id', p.id, 'name', p.name)
        END) as team1_players,
      GROUP_CONCAT(CASE 
        WHEN gp.team = 2 THEN json_object('id', p.id, 'name', p.name)
        END) as team2_players
    FROM games g
    JOIN game_players gp ON g.id = gp.game_id
    JOIN players p ON gp.player_id = p.id
    GROUP BY g.id
    ORDER BY g.date DESC
  `).all();

  return games.map(game => ({
    id: game.id,
    date: game.date,
    team1: {
      players: game.team1_players.split(',').map(p => JSON.parse(p)) as [Player, Player],
      score: game.team1_score
    },
    team2: {
      players: game.team2_players.split(',').map(p => JSON.parse(p)) as [Player, Player],
      score: game.team2_score
    },
    duration: game.duration
  }));
}

export function getPlayerStats(): Record<string, PlayerStats> {
  const stats = db.prepare(`
    WITH player_games AS (
      SELECT 
        p.id,
        p.name,
        g.id as game_id,
        gp.team,
        g.team1_score,
        g.team2_score,
        CASE 
          WHEN (gp.team = 1 AND g.team1_score > g.team2_score) OR
               (gp.team = 2 AND g.team2_score > g.team1_score)
          THEN 1
          ELSE 0
        END as won
      FROM players p
      JOIN game_players gp ON p.id = gp.player_id
      JOIN games g ON gp.game_id = g.id
    )
    SELECT 
      id,
      COUNT(DISTINCT game_id) as games_played,
      SUM(won) as games_won,
      CAST(SUM(won) AS FLOAT) / COUNT(DISTINCT game_id) as win_rate,
      SUM(CASE WHEN team = 1 THEN team1_score ELSE team2_score END) as total_points
    FROM player_games
    GROUP BY id
  `).all();

  return stats.reduce((acc, stat) => ({
    ...acc,
    [stat.id]: {
      gamesPlayed: stat.games_played,
      gamesWon: stat.games_won,
      winRate: stat.win_rate,
      totalPoints: stat.total_points
    }
  }), {});
}