import React from 'react';
import { useGame } from '../context/GameContext';
import { CONTROLS } from '../constants/gameConstants';

export const StartScreen: React.FC = () => {
  const { dispatch, state } = useGame();
  const { isSinglePlayer } = state;

  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  return (
    <div className="start-screen">
      <h1 className="game-title">Matrix Invaders</h1>
      <button onClick={handleStartGame}>Start Game</button>
      
      <div className="controls-info">
        <div className="player-controls">
          <h3>Player 1</h3>
          {isSinglePlayer ? (
            <>
              <p>TAP to shoot</p>
              <p>SLIDE LEFT/RIGHT to move</p>
            </>
          ) : (
            <>
              <p>LEFT: {CONTROLS.PLAYER1.LEFT.toUpperCase()}</p>
              <p>RIGHT: {CONTROLS.PLAYER1.RIGHT.toUpperCase()}</p>
              <p>FIRE: {CONTROLS.PLAYER1.FIRE.toUpperCase()}</p>
            </>
          )}
        </div>
        
        {!isSinglePlayer && (
          <div className="player-controls">
            <h3>Player 2</h3>
            <p>LEFT: ←</p>
            <p>RIGHT: →</p>
            <p>FIRE: ↑</p>
          </div>
        )}
      </div>
    </div>
  );
};