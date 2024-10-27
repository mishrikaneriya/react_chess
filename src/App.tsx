import React from 'react';
import ChessBoard from './components/ChessBoard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900">React Chess</h1>
          <p className="text-amber-700 mt-2">A modern chess game built with React</p>
        </header>
        
        <ChessBoard />
      </div>
    </div>
  );
}

export default App;