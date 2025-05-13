import React, { useEffect } from 'react';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';
import './App.css';

function App() {
  useEffect(() => {
    // Update the document title
    document.title = 'Matrix Invaders';
    
    // Prevent arrow key scrolling
    const handleKeyDown = (e: KeyboardEvent) => {
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 'd'].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <GameProvider>
      <div className="app">
        <Game />
      </div>
    </GameProvider>
  );
}

export default App;