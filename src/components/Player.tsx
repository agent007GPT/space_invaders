import React from 'react';
import { Player as PlayerType } from '../types/gameTypes';
import { getPlayerShape } from '../utils/pixelShapes';

interface PlayerProps {
  player: PlayerType;
}

export const Player: React.FC<PlayerProps> = ({ player }) => {
  const playerPixels = getPlayerShape(player.playerNumber);

  return (
    <div
      className="player-ship"
      style={{
        position: 'absolute',
        left: `${player.x}px`,
        top: `${player.y}px`,
        width: `${player.width}px`,
        height: `${player.height}px`
      }}
    >
      {playerPixels.map((row, rowIndex) => (
        <div key={rowIndex} className="pixel-row" style={{ display: 'flex' }}>
          {row.map((isActive, colIndex) => (
            <div
              key={colIndex}
              className={`pixel ${isActive ? 'active' : ''}`}
              style={{
                width: '3px',
                height: '3px',
                backgroundColor: isActive ? '#00ff00' : 'transparent'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};