import React from 'react';
import { Piece, Position } from '../types/chess';
import {
  Crown,
  Cross,
  CircleDot,
  Sword,
  Castle,
  ChevronUp
} from 'lucide-react';

interface ChessPieceProps {
  piece: Piece;
  position?: Position;
  onDragStart?: (position: Position) => void;
}

const pieceIcons = {
  king: Crown,
  queen: Cross,
  bishop: CircleDot,
  knight: Sword,
  rook: Castle,
  pawn: ChevronUp,
};

export default function ChessPiece({ piece, position, onDragStart }: ChessPieceProps) {
  const Icon = pieceIcons[piece.type];

  return (
    <div
      draggable={!!position}
      onDragStart={() => position && onDragStart?.(position)}
      className={`
        w-full h-full flex items-center justify-center
        cursor-grab active:cursor-grabbing
        transition-transform hover:scale-110
        select-none
      `}
    >
      <Icon 
        className={`w-8 h-8 lg:w-10 lg:h-10 ${
          piece.color === 'white' ? 'text-gray-200 stroke-2' : 'text-gray-900 stroke-2'
        }`}
      />
    </div>
  );
}