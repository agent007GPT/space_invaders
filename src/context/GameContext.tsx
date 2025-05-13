import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { GameState, GameAction, Player, Invader, Bunker } from '../types/gameTypes';
import { gameReducer, initialState } from '../reducers/gameReducer';
import { 
  CONTROLS, 
  INVADER_SHOOTING_CHANCE, 
  INVADER_MOVE_INTERVAL, 
  FRAME_RATE,
  getGameDimensions,
  INVADER_WIDTH,
  INVADER_BOUNDARY_PADDING
} from '../constants/gameConstants';
import { useGameLoop } from '../hooks/useGameLoop';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [state, dispatch] = useReducer(gameReducer, { ...initialState, isSinglePlayer: isMobile });
  const { isStarted, isPaused, isGameOver, invaders, isSinglePlayer } = state;
  const { width: GAME_WIDTH } = getGameDimensions();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile !== isSinglePlayer) {
        dispatch({ type: 'SET_SINGLE_PLAYER', payload: { isSinglePlayer: mobile } });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSinglePlayer]);

  // Set up keyboard controls
  useEffect(() => {
    if (!isStarted || isPaused || isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Player 1 controls
      if (e.key === CONTROLS.PLAYER1.LEFT) {
        dispatch({ type: 'MOVE_PLAYER', payload: { playerId: 'player1', direction: 'left' } });
      } else if (e.key === CONTROLS.PLAYER1.RIGHT) {
        dispatch({ type: 'MOVE_PLAYER', payload: { playerId: 'player1', direction: 'right' } });
      } else if (e.key === CONTROLS.PLAYER1.FIRE) {
        dispatch({ type: 'PLAYER_SHOOT', payload: { playerId: 'player1' } });
      }

      // Player 2 controls (only if not in single player mode)
      if (!isSinglePlayer) {
        if (e.key === CONTROLS.PLAYER2.LEFT) {
          dispatch({ type: 'MOVE_PLAYER', payload: { playerId: 'player2', direction: 'left' } });
        } else if (e.key === CONTROLS.PLAYER2.RIGHT) {
          dispatch({ type: 'MOVE_PLAYER', payload: { playerId: 'player2', direction: 'right' } });
        } else if (e.key === CONTROLS.PLAYER2.FIRE) {
          dispatch({ type: 'PLAYER_SHOOT', payload: { playerId: 'player2' } });
        }
      }

      // Pause game
      if (e.key === 'p' || e.key === 'P') {
        dispatch({ type: 'TOGGLE_PAUSE' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, isPaused, isGameOver, isSinglePlayer]);

  // Game loop
  useGameLoop(
    (deltaTime) => {
      if (!isStarted || isPaused || isGameOver) return;

      // Move shots
      dispatch({ type: 'MOVE_SHOTS' });

      // Check for collisions
      dispatch({ type: 'CHECK_COLLISIONS' });

      // Random enemy shooting
      invaders.forEach(invader => {
        if (Math.random() < INVADER_SHOOTING_CHANCE) {
          dispatch({ type: 'INVADER_SHOOT', payload: { invaderId: invader.id } });
        }
      });
    },
    FRAME_RATE
  );

  // Invader movement timer
  useEffect(() => {
    if (!isStarted || isPaused || isGameOver) return;

    // Calculate move interval based on number of invaders remaining
    const speedMultiplier = Math.max(0.2, invaders.length / (initialState.invaders.length));
    const currentMoveInterval = INVADER_MOVE_INTERVAL * speedMultiplier;

    let moveDirection: 'left' | 'right' = 'right';
    let moveDown = false;

    const invaderMoveTimer = setInterval(() => {
      // If we need to move down, do so and then switch direction
      if (moveDown) {
        dispatch({ type: 'MOVE_INVADERS', payload: { direction: 'down' } });
        moveDown = false;
      } else {
        dispatch({ type: 'MOVE_INVADERS', payload: { direction: moveDirection } });
        
        // Check if invaders have reached the edge
        const shouldMoveDown = checkIfInvadersReachedEdge(state.invaders, GAME_WIDTH);
        
        if (shouldMoveDown) {
          moveDown = true;
          moveDirection = moveDirection === 'left' ? 'right' : 'left';
        }
      }
    }, currentMoveInterval);

    return () => clearInterval(invaderMoveTimer);
  }, [isStarted, isPaused, isGameOver, invaders.length]);

  // Check if the wave is cleared
  useEffect(() => {
    if (isStarted && !isPaused && !isGameOver && invaders.length === 0) {
      dispatch({ type: 'NEXT_WAVE' });
    }
  }, [isStarted, isPaused, isGameOver, invaders.length]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Helper function to check if invaders have reached the edge
function checkIfInvadersReachedEdge(invaders: Invader[], gameWidth: number): boolean {
  if (invaders.length === 0) return false;
  
  let leftmostX = Number.MAX_SAFE_INTEGER;
  let rightmostX = 0;
  
  invaders.forEach(invader => {
    leftmostX = Math.min(leftmostX, invader.x);
    rightmostX = Math.max(rightmostX, invader.x + invader.width);
  });
  
  return leftmostX <= INVADER_BOUNDARY_PADDING || rightmostX >= gameWidth - INVADER_BOUNDARY_PADDING;
}