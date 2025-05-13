import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Player } from './Player';
import { Invader } from './Invader';
import { Shot } from './Shot';
import { Bunker } from './Bunker';
import { getGameDimensions, PLAYER_SPEED } from '../constants/gameConstants';

export const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, invaders, shots, bunkers, isSinglePlayer } = state;
  const touchStartXRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const { width: GAME_WIDTH, height: GAME_HEIGHT } = getGameDimensions();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchStartXRef.current = touch.clientX;
      
      // Fire on tap
      dispatch({ type: 'PLAYER_SHOOT', payload: { playerId: 'player1' } });
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchStartXRef.current === null) return;

      const now = Date.now();
      if (now - lastMoveTimeRef.current < 16) return; // Limit to ~60fps
      lastMoveTimeRef.current = now;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartXRef.current;
      touchStartXRef.current = touch.clientX;

      // Scale movement based on screen width
      const moveThreshold = GAME_WIDTH * 0.01;
      if (Math.abs(deltaX) > moveThreshold) {
        if (deltaX < 0) {
          dispatch({ type: 'MOVE_PLAYER', payload: { playerId: 'player1', direction: 'left' } });
        } else {
          dispatch({ type: 'MOVE_PLAYER', payload: { playerId: 'player1', direction: 'right' } });
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartXRef.current = null;
    };

    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) {
      gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
      gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
      gameBoard.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (gameBoard) {
        gameBoard.removeEventListener('touchstart', handleTouchStart);
        gameBoard.removeEventListener('touchmove', handleTouchMove);
        gameBoard.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [dispatch, GAME_WIDTH]);

  return (
    <div 
      className="game-board"
      style={{ 
        width: `${GAME_WIDTH}px`, 
        height: `${GAME_HEIGHT}px`,
        position: 'relative',
        backgroundColor: '#000',
        border: '1px solid #00ff00',
        overflow: 'hidden',
        margin: '0 auto',
        transform: 'translateZ(0)', // Force GPU acceleration
        willChange: 'transform' // Hint to browser about animations
      }}
    >
      {/* Render players */}
      {players.map(player => (
        (player.active && (!isSinglePlayer || player.playerNumber === 1)) && 
        <Player key={player.id} player={player} />
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
    </div>
  );
};