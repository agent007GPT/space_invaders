import React from 'react';
import { useGame } from '../context/GameContext';
import { GameBoard } from './GameBoard';
import { GameUI } from './GameUI';
import { GameOver } from './GameOver';
import { StartScreen } from './StartScreen';
import '../styles/game.css';

const Game: React.FC = () => {
  const { state } = useGame();
  const { isGameOver, isStarted } = state;

  return (
    <div className="game-container">
      {!isStarted ? (
        <StartScreen />
      ) : (
        <>
          <GameUI />
          <GameBoard />
          {isGameOver && <GameOver />}
        </>
      )}
    </div>
  );
};

export default Game;