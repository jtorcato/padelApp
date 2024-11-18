import React from 'react';
import { Calendar } from 'lucide-react';
import type { Game } from '../types';

interface GamesListProps {
  games: Game[];
}

export function GamesList({ games }: GamesListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-indigo-400">Recent Games</h2>
      <div className="grid gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-800 rounded-lg shadow-xl p-4 hover:shadow-2xl transition-shadow border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(game.date).toLocaleDateString()}</span>
              </div>
              <span className="text-sm text-gray-400">{game.duration} min</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-indigo-400">Team 1</div>
                <div className="text-sm text-gray-400">
                  {game.team1.players.map(p => p.name).join(' & ')}
                </div>
                <div className="text-2xl font-bold mt-1">{game.team1.score}</div>
              </div>
              
              <div>
                <div className="font-medium text-indigo-400">Team 2</div>
                <div className="text-sm text-gray-400">
                  {game.team2.players.map(p => p.name).join(' & ')}
                </div>
                <div className="text-2xl font-bold mt-1">{game.team2.score}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}