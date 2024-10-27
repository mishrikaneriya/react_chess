import React from 'react';
import { Settings, RotateCcw, Play } from 'lucide-react';

interface GameControlsProps {
  onUndo: () => void;
  onReset: () => void;
  onSetupAI: () => void;
  currentPlayer: 'white' | 'black';
  moveHistory: any[];
  isAIEnabled: boolean;
}

export default function GameControls({
  onUndo,
  onReset,
  onSetupAI,
  currentPlayer,
  moveHistory,
  isAIEnabled,
}: GameControlsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Game Controls</h2>
      <div className="space-y-4">
        <p className="font-medium">Current Turn: <span className="capitalize">{currentPlayer}</span></p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onUndo}
            disabled={moveHistory.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Undo Move
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Settings className="w-4 h-4" />
            Reset Game
          </button>
          <button
            onClick={onSetupAI}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isAIEnabled 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            <Play className="w-4 h-4" />
            {isAIEnabled ? 'AI Enabled' : 'Enable AI'}
          </button>
        </div>
      </div>
    </div>
  );
}