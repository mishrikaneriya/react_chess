import React, { useState, useEffect } from 'react';
import { Piece, Position, Move } from '../types/chess';
import { initialBoard, isValidMove, getValidMoves } from '../utils/chessLogic';
import ChessPiece from './ChessPiece';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import CapturedPieces from './CapturedPieces';
import { GeminiService } from '../services/geminiService';

export default function ChessBoard() {
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);

  const setupAI = async () => {
    const apiKey = prompt('Please enter your Gemini API key:');
    if (apiKey) {
      try {
        const service = new GeminiService(apiKey);
        setGeminiService(service);
        setIsAIEnabled(true);
        alert('AI successfully enabled!');
      } catch (error) {
        console.error('Error setting up AI:', error);
        alert('Failed to initialize AI. Please check your API key.');
      }
    }
  };

  useEffect(() => {
    if (isAIEnabled && geminiService && currentPlayer === 'black') {
      makeAIMove();
    }
  }, [currentPlayer, isAIEnabled]);

  const makeAIMove = async () => {
    if (!geminiService) return;

    try {
      const boardState = getBoardStateString();
      const moveHistoryString = getMoveHistoryString();
      const aiMove = await geminiService.getNextMove(boardState, moveHistoryString);
      
      // Convert algebraic notation to board positions
      const from: Position = {
        col: aiMove.charCodeAt(0) - 97,
        row: 8 - parseInt(aiMove[1])
      };
      const to: Position = {
        col: aiMove.charCodeAt(2) - 97,
        row: 8 - parseInt(aiMove[3])
      };

      handleMove(from, to);
    } catch (error) {
      console.error('AI move error:', error);
      alert('Error making AI move. Disabling AI.');
      setIsAIEnabled(false);
    }
  };

  const getBoardStateString = () => {
    return board.map((row, i) => 
      row.map(piece => {
        if (!piece) return '.';
        const color = piece.color === 'white' ? 'w' : 'b';
        const type = piece.type[0].toUpperCase();
        return color + type;
      }).join(' ')
    ).join('\n');
  };

  const getMoveHistoryString = () => {
    return moveHistory.map((move, i) => 
      `${i + 1}. ${move.piece.color} ${move.piece.type} ${String.fromCharCode(97 + move.from.col)}${8 - move.from.row} to ${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`
    ).join('\n');
  };

  const handleDragStart = (position: Position) => {
    const piece = board[position.row][position.col];
    if (piece?.color !== currentPlayer || (isAIEnabled && currentPlayer === 'black')) return false;
    
    setSelectedPiece(position);
    setValidMoves(getValidMoves(position, board));
  };

  const handleMove = (from: Position, to: Position) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    const capturedPiece = newBoard[to.row][to.col];

    if (capturedPiece) {
      setCapturedPieces([...capturedPieces, capturedPiece]);
    }

    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    const move: Move = {
      from,
      to,
      piece: piece!,
      capturedPiece
    };

    setBoard(newBoard);
    setMoveHistory([...moveHistory, move]);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
  };

  const handleDrop = (toPosition: Position) => {
    if (!selectedPiece) return;

    const isValid = validMoves.some(
      move => move.row === toPosition.row && move.col === toPosition.col
    );

    if (isValid) {
      handleMove(selectedPiece, toPosition);
    }

    setSelectedPiece(null);
    setValidMoves([]);
  };

  const undoMove = () => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const newBoard = board.map(row => [...row]);

    newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece;
    newBoard[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece || null;

    setBoard(newBoard);
    setMoveHistory(moveHistory.slice(0, -1));
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

    if (lastMove.capturedPiece) {
      setCapturedPieces(capturedPieces.slice(0, -1));
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('white');
    setMoveHistory([]);
    setCapturedPieces([]);
    setSelectedPiece(null);
    setValidMoves([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 max-w-7xl mx-auto">
      <div className="flex-1">
        <div className="aspect-square">
          <div className="grid grid-cols-8 h-full w-full border-2 border-gray-800 rounded-lg overflow-hidden shadow-xl">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const isValidMove = validMoves.some(
                  move => move.row === rowIndex && move.col === colIndex
                );
                const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      relative
                      ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                      ${isValidMove ? 'ring-2 ring-green-500 ring-inset' : ''}
                      ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                      transition-all duration-200
                    `}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('bg-green-200');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('bg-green-200');
                    }}
                    onDrop={(e) => {
                      e.currentTarget.classList.remove('bg-green-200');
                      handleDrop({ row: rowIndex, col: colIndex });
                    }}
                  >
                    {piece && (
                      <ChessPiece
                        piece={piece}
                        position={{ row: rowIndex, col: colIndex }}
                        onDragStart={handleDragStart}
                      />
                    )}
                    {isValidMove && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-20 pointer-events-none" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full lg:w-80">
        <GameControls
          onUndo={undoMove}
          onReset={resetGame}
          onSetupAI={setupAI}
          currentPlayer={currentPlayer}
          moveHistory={moveHistory}
          isAIEnabled={isAIEnabled}
        />
        
        <MoveHistory moves={moveHistory} />
        
        <CapturedPieces pieces={capturedPieces} />
      </div>
    </div>
  );
}