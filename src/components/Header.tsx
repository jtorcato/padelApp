import React from 'react';
import { Trophy } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-6 px-4 shadow-lg border-b border-indigo-800/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Padel Score Tracker
          </h1>
        </div>
        <nav className="flex gap-6">
          <button className="hover:text-indigo-400 transition-colors">Games</button>
          <button className="hover:text-indigo-400 transition-colors">Statistics</button>
        </nav>
      </div>
    </header>
  );
}