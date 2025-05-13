import React from 'react';
import { Bunker as BunkerType } from '../types/gameTypes';
import { SHOT_WIDTH, SHOT_HEIGHT } from '../constants/gameConstants';

interface BunkerProps {
  bunker: BunkerType;
}

export const Bunker: React.FC<BunkerProps> = ({ bunker }) => {
  return (
    <div
      className="bunker"
      style={{
        position: 'absolute',
        left: `${bunker.x}px`,
        top: `${bunker.y}px`,
        width: `${bunker.width}px`,
        height: `${bunker.height}px`
      }}
    >
      {bunker.grid.map((row, rowIndex) => (
        <div key={rowIndex} className="bunker-row" style={{ display: 'flex' }}>
          {row.map((isActive, colIndex) => (
            <div
              key={colIndex}
              className={`bunker-segment ${isActive ? 'active' : ''}`}
              style={{
                width: `${SHOT_WIDTH}px`,
                height: `${SHOT_HEIGHT}px`,
                backgroundColor: isActive ? '#00ff00' : 'transparent'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};