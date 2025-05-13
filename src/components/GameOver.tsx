import React from 'react';
import { useGame } from '../context/GameContext';

export const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, wave } = state;
  const totalScore = players.reduce((sum, player) => sum + (player?.score || 0), 0);

  const handlePlayAgain = () => {
    dispatch({ type: 'START_GAME' });
  };

  return (
    <div className="game-over">
      <h1>Game Over</h1>
      <p>Player 1 Score: {players[0]?.score || 0}</p>
      <p>Player 2 Score: {players[1]?.score || 0}</p>
      <p>Total Score: {totalScore}</p>
      <p>Waves Survived: {wave}</p>
      <button onClick={handlePlayAgain}>Play Again</button>
    </div>
  );
};