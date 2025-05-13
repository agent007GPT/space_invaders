import React from 'react';
import { Invader as InvaderType } from '../types/gameTypes';
import { getInvaderShape } from '../utils/pixelShapes';

interface InvaderProps {
  invader: InvaderType;
}

export const Invader: React.FC<InvaderProps> = ({ invader }) => {
  const invaderPixels = getInvaderShape(invader.row % 3); // Use different shapes based on row

  return (
    <div
      className="invader"
      style={{
        position: 'absolute',
        left: `${invader.x}px`,
        top: `${invader.y}px`,
        width: `${invader.width}px`,
        height: `${invader.height}px`
      }}
    >
      {invaderPixels.map((row, rowIndex) => (
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