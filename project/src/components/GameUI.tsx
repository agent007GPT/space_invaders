import React from 'react';
import { useGame } from '../context/GameContext';
import { INITIAL_LIVES } from '../constants/gameConstants';

export const GameUI: React.FC = () => {
  const { state } = useGame();
  const { wave, players } = state;

  return (
    <div className="game-ui">
      <h1 className="game-title">Matrix Invaders</h1>
      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">P1 SCORE:</span>
          <span className="stat-value">{players[0].score.toString().padStart(6, '0')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">P2 SCORE:</span>
          <span className="stat-value">{players[1].score.toString().padStart(6, '0')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">WAVE:</span>
          <span className="stat-value">{wave}</span>
        </div>
      </div>
      <div className="game-lives">
        <div className="player-lives">
          <span className="player-label">P1:</span>
          <div className="lives-icons">
            {Array.from({ length: INITIAL_LIVES }).map((_, index) => (
              <span 
                key={index} 
                className={`life-icon ${index < players[0]?.lives ? 'active' : 'inactive'}`}
              >
                ■
              </span>
            ))}
          </div>
        </div>
        <div className="player-lives">
          <span className="player-label">P2:</span>
          <div className="lives-icons">
            {Array.from({ length: INITIAL_LIVES }).map((_, index) => (
              <span 
                key={index} 
                className={`life-icon ${index < players[1]?.lives ? 'active' : 'inactive'}`}
              >
                ■
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};