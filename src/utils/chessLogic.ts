import { Piece, Position, PieceType, PieceColor } from '../types/chess';

export const initialBoard: (Piece | null)[][] = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ],
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' })),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ],
];

export const isValidMove = (
  from: Position,
  to: Position,
  board: (Piece | null)[][],
  currentPlayer: PieceColor
): boolean => {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== currentPlayer) return false;
  
  // Basic movement validation
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  
  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      
      // Regular move
      if (colDiff === 0 && to.row === from.row + direction && !board[to.row][to.col]) {
        return true;
      }
      
      // Initial double move
      if (from.row === startRow && colDiff === 0 && to.row === from.row + 2 * direction) {
        return !board[to.row][to.col] && !board[from.row + direction][from.col];
      }
      
      // Capture
      if (colDiff === 1 && to.row === from.row + direction) {
        const targetPiece = board[to.row][to.col];
        return targetPiece !== null && targetPiece.color !== piece.color;
      }
      
      return false;

    case 'knight':
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    // Add other piece validations as needed
    default:
      return true; // Simplified for this example
  }
};

export const getValidMoves = (
  position: Position,
  board: (Piece | null)[][]
): Position[] => {
  const validMoves: Position[] = [];
  const piece = board[position.row][position.col];
  
  if (!piece) return [];

  // Check all possible positions
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(position, { row, col }, board, piece.color)) {
        validMoves.push({ row, col });
      }
    }
  }

  return validMoves;
};