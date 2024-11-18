import React from 'react';
import { BarChart, Trophy, Users } from 'lucide-react';
import type { Game, PlayerStats } from '../types';

interface StatisticsProps {
  games: Game[];
}

export function Statistics({ games }: StatisticsProps) {
  const totalGames = games.length;
  const averagePoints = games.reduce((acc, game) => 
    acc + game.team1.score + game.team2.score, 0) / (totalGames || 1);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-indigo-400">Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium text-gray-300">Total Games</h3>
          </div>
          <p className="text-3xl font-bold">{totalGames}</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <BarChart className="w-5 h-5 text-indigo-400" />
            <h3 className="font-medium text-gray-300">Avg Points/Game</h3>
          </div>
          <p className="text-3xl font-bold">{averagePoints.toFixed(1)}</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="font-medium text-gray-300">Total Players</h3>
          </div>
          <p className="text-3xl font-bold">
            {new Set(games.flatMap(g => [
              ...g.team1.players,
              ...g.team2.players
            ]).map(p => p.id)).size}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700/50">
        <h3 className="font-medium mb-4 text-indigo-400">Recent Performance</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart will be implemented here
        </div>
      </div>
    </div>
  );
}