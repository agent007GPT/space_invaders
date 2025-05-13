import React from 'react';
import { Shot as ShotType } from '../types/gameTypes';

interface ShotProps {
  shot: ShotType;
}

export const Shot: React.FC<ShotProps> = ({ shot }) => {
  return (
    <div
      className={`shot ${shot.direction === 'up' ? 'player-shot' : 'enemy-shot'}`}
      style={{
        position: 'absolute',
        left: `${shot.x}px`,
        top: `${shot.y}px`,
        width: `${shot.width}px`,
        height: `${shot.height}px`,
        backgroundColor: '#00ff00',
        boxShadow: '0 0 2px #00ff00'
      }}
    />
  );
};