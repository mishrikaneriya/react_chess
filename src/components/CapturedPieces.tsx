import React from 'react';
import { Piece } from '../types/chess';
import ChessPiece from './ChessPiece';

interface CapturedPiecesProps {
  pieces: Piece[];
}

export default function CapturedPieces({ pieces }: CapturedPiecesProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Captured Pieces</h2>
      <div className="flex flex-wrap gap-2">
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center ${
              piece.color === 'white' ? 'text-gray-700' : 'text-gray-900'
            }`}
          >
            <ChessPiece piece={piece} />
          </div>
        ))}
      </div>
    </div>
  );
}