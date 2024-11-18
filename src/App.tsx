import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GameForm } from './components/GameForm';
import { GamesList } from './components/GamesList';
import { Statistics } from './components/Statistics';
import { loadGames, saveGame } from './db';
import type { Game } from './types';

export function App() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    setGames(loadGames());
  }, []);

  const handleSaveGame = (newGame: Omit<Game, 'id'>) => {
    const savedGame = saveGame(newGame);
    setGames(prevGames => [savedGame, ...prevGames]);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <GameForm onSaveGame={handleSaveGame} />
            <GamesList games={games} />
          </div>
          <div>
            <Statistics games={games} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;