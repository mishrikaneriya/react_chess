import React from 'react';
import { Move } from '../types/chess';

interface MoveHistoryProps {
  moves: Move[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Move History</h2>
      <div className="max-h-48 overflow-y-auto space-y-1">
        {moves.map((move, index) => (
          <div key={index} className="text-sm">
            {index + 1}. {move.piece.color} {move.piece.type} from {String.fromCharCode(97 + move.from.col)}{8 - move.from.row} to {String.fromCharCode(97 + move.to.col)}{8 - move.to.row}
            {move.capturedPiece && ` (captured ${move.capturedPiece.color} ${move.capturedPiece.type})`}
          </div>
        ))}
      </div>
    </div>
  );
}