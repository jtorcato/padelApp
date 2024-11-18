import React, { useState } from 'react';
import { Plus, Minus, Clock } from 'lucide-react';
import type { Game, Player } from '../types';

interface GameFormProps {
  onSaveGame: (game: Omit<Game, 'id'>) => void;
}

export function GameForm({ onSaveGame }: GameFormProps) {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Players, setTeam1Players] = useState<[string, string]>(['', '']);
  const [team2Players, setTeam2Players] = useState<[string, string]>(['', '']);
  const [duration, setDuration] = useState(45);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team1Players[0] || !team1Players[1] || !team2Players[0] || !team2Players[1]) {
      alert('Please fill in all player names');
      return;
    }

    const newGame = {
      date: new Date().toISOString().split('T')[0],
      team1: {
        players: [
          { id: crypto.randomUUID(), name: team1Players[0] },
          { id: crypto.randomUUID(), name: team1Players[1] }
        ] as [Player, Player],
        score: team1Score
      },
      team2: {
        players: [
          { id: crypto.randomUUID(), name: team2Players[0] },
          { id: crypto.randomUUID(), name: team2Players[1] }
        ] as [Player, Player],
        score: team2Score
      },
      duration
    };

    onSaveGame(newGame);
    
    // Reset form
    setTeam1Score(0);
    setTeam2Score(0);
    setTeam1Players(['', '']);
    setTeam2Players(['', '']);
    setDuration(45);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700/50">
      <h2 className="text-xl font-semibold mb-4 text-indigo-400">New Game</h2>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Team 1 */}
        <div className="space-y-4">
          <h3 className="font-medium text-indigo-400">Team 1</h3>
          <input
            type="text"
            placeholder="Player 1 Name"
            value={team1Players[0]}
            onChange={(e) => setTeam1Players([e.target.value, team1Players[1]])}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Player 2 Name"
            value={team1Players[1]}
            onChange={(e) => setTeam1Players([team1Players[0], e.target.value])}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTeam1Score(Math.max(0, team1Score - 1))}
              className="p-2 rounded-full hover:bg-gray-700 text-indigo-400"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-2xl font-bold">{team1Score}</span>
            <button
              type="button"
              onClick={() => setTeam1Score(team1Score + 1)}
              className="p-2 rounded-full hover:bg-gray-700 text-indigo-400"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Team 2 */}
        <div className="space-y-4">
          <h3 className="font-medium text-indigo-400">Team 2</h3>
          <input
            type="text"
            placeholder="Player 1 Name"
            value={team2Players[0]}
            onChange={(e) => setTeam2Players([e.target.value, team2Players[1]])}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Player 2 Name"
            value={team2Players[1]}
            onChange={(e) => setTeam2Players([team2Players[0], e.target.value])}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTeam2Score(Math.max(0, team2Score - 1))}
              className="p-2 rounded-full hover:bg-gray-700 text-indigo-400"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-2xl font-bold">{team2Score}</span>
            <button
              type="button"
              onClick={() => setTeam2Score(team2Score + 1)}
              className="p-2 rounded-full hover:bg-gray-700 text-indigo-400"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Clock className="w-5 h-5 text-gray-400" />
        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
          className="w-20 px-3 py-2 border rounded-md"
          required
        />
        <span className="text-gray-400">minutes</span>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all"
      >
        Save Game
      </button>
    </form>
  );
}