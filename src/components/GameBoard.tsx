import React from 'react';
import { useGame } from '../context/GameContext';
import { Player } from './Player';
import { Invader } from './Invader';
import { Shot } from './Shot';
import { Bunker } from './Bunker';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants/gameConstants';

export const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { players, invaders, shots, bunkers } = state;

  return (
    <div 
      className="game-board"
      style={{ 
        width: `${GAME_WIDTH}px`, 
        height: `${GAME_HEIGHT}px`,
        position: 'relative',
        backgroundColor: '#000',
        border: '1px solid #00ff00',
        overflow: 'hidden'
      }}
    >
      {/* Render players */}
      {players.map(player => (
        player.active && <Player key={player.id} player={player} />
      ))}

      {/* Render invaders */}
      {invaders.map(invader => (
        <Invader key={invader.id} invader={invader} />
      ))}

      {/* Render shots */}
      {shots.map(shot => (
        <Shot key={shot.id} shot={shot} />
      ))}

      {/* Render bunkers */}
      {bunkers.map(bunker => (
        <Bunker key={bunker.id} bunker={bunker} />
      ))}

      {/* Game over line (for debugging) */}
      {/* <div 
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: `${PLAYER_HEIGHT + 30}px`,
          height: '1px',
          backgroundColor: 'red',
          zIndex: 10
        }}
      /> */}
    </div>
  );
};