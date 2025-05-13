import { v4 as uuidv4 } from 'uuid';
import { GameState, GameAction, Player, Invader, Shot, Bunker } from '../types/gameTypes';
import { 
  getGameDimensions,
  PLAYER_WIDTH, 
  PLAYER_HEIGHT, 
  INVADER_WIDTH, 
  INVADER_HEIGHT,
  BUNKER_WIDTH,
  BUNKER_HEIGHT,
  SHOT_WIDTH,
  SHOT_HEIGHT,
  PLAYER_SPEED, 
  PLAYER_SHOT_SPEED, 
  INVADER_SHOT_SPEED,
  INVADER_DROP_DISTANCE,
  INVADER_ROWS,
  INVADER_COLS,
  INVADER_ROW_GAP,
  INVADER_COL_GAP,
  BUNKER_COUNT,
  INITIAL_LIVES,
  INVADER_POINTS,
  GAME_OVER_LINE
} from '../constants/gameConstants';

const { width: GAME_WIDTH, height: GAME_HEIGHT } = getGameDimensions();

// Create initial players
const createPlayers = (isSinglePlayer: boolean = false): Player[] => {
  const players: Player[] = [
    {
      id: 'player1',
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GAME_HEIGHT - PLAYER_HEIGHT - 10,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      lives: INITIAL_LIVES,
      canShoot: true,
      active: true,
      playerNumber: 1,
      score: 0
    }
  ];

  if (!isSinglePlayer) {
    players.push({
      id: 'player2',
      x: (GAME_WIDTH * 2) / 3 - PLAYER_WIDTH / 2,
      y: GAME_HEIGHT - PLAYER_HEIGHT - 10,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      lives: INITIAL_LIVES,
      canShoot: true,
      active: true,
      playerNumber: 2,
      score: 0
    });
  }

  return players;
};

// Create invaders formation
const createInvaders = (wave: number = 1): Invader[] => {
  const invaders: Invader[] = [];
  const maxCols = Math.min(INVADER_COLS, Math.floor((GAME_WIDTH - 40) / (INVADER_WIDTH + INVADER_COL_GAP)));
  const startX = (GAME_WIDTH - (maxCols * (INVADER_WIDTH + INVADER_COL_GAP) - INVADER_COL_GAP)) / 2;
  const startY = 50 + Math.min(100, (wave - 1) * 20);

  for (let row = 0; row < INVADER_ROWS; row++) {
    for (let col = 0; col < maxCols; col++) {
      invaders.push({
        id: `invader-${row}-${col}-${uuidv4()}`,
        x: startX + col * (INVADER_WIDTH + INVADER_COL_GAP),
        y: startY + row * (INVADER_HEIGHT + INVADER_ROW_GAP),
        width: INVADER_WIDTH,
        height: INVADER_HEIGHT,
        points: INVADER_POINTS[row] || 10,
        row,
        col,
        active: true
      });
    }
  }

  return invaders;
};

// Create bunkers
const createBunkers = (): Bunker[] => {
  const bunkers: Bunker[] = [];
  const bunkerSpacing = GAME_WIDTH / (BUNKER_COUNT + 1);

  for (let i = 0; i < BUNKER_COUNT; i++) {
    const grid: boolean[][] = [];
    for (let y = 0; y < BUNKER_HEIGHT / SHOT_HEIGHT; y++) {
      grid[y] = [];
      for (let x = 0; x < BUNKER_WIDTH / SHOT_WIDTH; x++) {
        const isNotch = y < 5 && x > 8 && x < 16;
        grid[y][x] = !isNotch;
      }
    }

    bunkers.push({
      id: `bunker-${i}`,
      x: (i + 1) * bunkerSpacing - BUNKER_WIDTH / 2,
      y: GAME_HEIGHT - PLAYER_HEIGHT - BUNKER_HEIGHT - 40,
      width: BUNKER_WIDTH,
      height: BUNKER_HEIGHT,
      grid,
      active: true
    });
  }

  return bunkers;
};

// Initial game state
export const initialState: GameState = {
  players: createPlayers(),
  invaders: createInvaders(1),
  shots: [],
  bunkers: createBunkers(),
  wave: 1,
  isGameOver: false,
  isStarted: false,
  isPaused: false,
  isSinglePlayer: false
};

// Check for collisions between two objects
const isColliding = (obj1: { x: number; y: number; width: number; height: number }, 
                    obj2: { x: number; y: number; width: number; height: number }): boolean => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

// Game reducer
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SINGLE_PLAYER':
      return {
        ...state,
        isSinglePlayer: action.payload.isSinglePlayer,
        players: createPlayers(action.payload.isSinglePlayer)
      };
    
    case 'START_GAME':
      return {
        ...initialState,
        isSinglePlayer: state.isSinglePlayer,
        players: createPlayers(state.isSinglePlayer),
        invaders: createInvaders(1),
        bunkers: createBunkers(),
        wave: 1,
        isStarted: true
      };

    case 'RESET_GAME':
      return {
        ...initialState
      };

    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isPaused: !state.isPaused
      };

    case 'NEXT_WAVE':
      const nextWave = state.wave + 1;
      return {
        ...state,
        invaders: createInvaders(nextWave),
        wave: nextWave,
        shots: [], // Clear all shots when starting a new wave
        bunkers: createBunkers() // Reset bunkers for each new wave
      };

    case 'MOVE_PLAYER': {
      const { playerId, direction } = action.payload;
      
      return {
        ...state,
        players: state.players.map(player => {
          if (player.id === playerId && player.active) {
            let newX = player.x;
            
            if (direction === 'left') {
              newX = Math.max(0, player.x - PLAYER_SPEED);
            } else if (direction === 'right') {
              newX = Math.min(GAME_WIDTH - player.width, player.x + PLAYER_SPEED);
            }
            
            return { ...player, x: newX };
          }
          return player;
        })
      };
    }

    case 'PLAYER_SHOOT': {
      const { playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (!player || !player.active || !player.canShoot) {
        return state;
      }
      
      const newShot: Shot = {
        id: `shot-${playerId}-${Date.now()}`,
        x: player.x + player.width / 2 - SHOT_WIDTH / 2,
        y: player.y - SHOT_HEIGHT,
        width: SHOT_WIDTH,
        height: SHOT_HEIGHT,
        playerId,
        direction: 'up',
        active: true
      };
      
      return {
        ...state,
        shots: [...state.shots, newShot],
        players: state.players.map(p => 
          p.id === playerId ? { ...p, canShoot: false } : p
        )
      };
    }

    case 'INVADER_SHOOT': {
      const { invaderId } = action.payload;
      const invader = state.invaders.find(i => i.id === invaderId);
      
      if (!invader || !invader.active) {
        return state;
      }
      
      const newShot: Shot = {
        id: `shot-${invaderId}-${Date.now()}`,
        x: invader.x + invader.width / 2 - SHOT_WIDTH / 2,
        y: invader.y + invader.height,
        width: SHOT_WIDTH,
        height: SHOT_HEIGHT,
        invaderId,
        direction: 'down',
        active: true
      };
      
      return {
        ...state,
        shots: [...state.shots, newShot]
      };
    }

    case 'MOVE_SHOTS': {
      const newShots = state.shots.filter(shot => {
        if (shot.direction === 'up') {
          shot.y -= PLAYER_SHOT_SPEED;
          return shot.y + shot.height > 0;
        } else {
          shot.y += INVADER_SHOT_SPEED;
          return shot.y < GAME_HEIGHT;
        }
      });
      
      const playerShots = new Set(newShots.filter(s => s.playerId).map(s => s.playerId));
      const updatedPlayers = state.players.map(player => ({
        ...player,
        canShoot: !playerShots.has(player.id)
      }));
      
      return {
        ...state,
        shots: newShots,
        players: updatedPlayers
      };
    }

    case 'MOVE_INVADERS': {
      const { direction } = action.payload;
      
      if (state.invaders.length === 0) {
        return state;
      }
      
      let newInvaders = [...state.invaders];
      
      if (direction === 'down') {
        newInvaders = newInvaders.map(invader => ({
          ...invader,
          y: invader.y + INVADER_DROP_DISTANCE
        }));
      } else {
        const moveAmount = 5;
        newInvaders = newInvaders.map(invader => ({
          ...invader,
          x: direction === 'left' ? invader.x - moveAmount : invader.x + moveAmount
        }));
      }
      
      const invaderReachedBottom = newInvaders.some(invader => 
        invader.y + invader.height >= GAME_OVER_LINE
      );
      
      return {
        ...state,
        invaders: newInvaders,
        isGameOver: invaderReachedBottom ? true : state.isGameOver
      };
    }

    case 'CHECK_COLLISIONS': {
      let newShots = [...state.shots];
      let newInvaders = [...state.invaders];
      let newPlayers = [...state.players];
      let newBunkers = [...state.bunkers];
      let gameOver = state.isGameOver;
      
      // Check player shots against invaders
      newShots.forEach(shot => {
        if (!shot.active || shot.direction !== 'up') return;
        
        newInvaders.forEach(invader => {
          if (!invader.active) return;
          
          if (isColliding(shot, invader)) {
            shot.active = false;
            invader.active = false;
            // Add points to the player who shot the invader
            if (shot.playerId) {
              newPlayers = newPlayers.map(player => 
                player.id === shot.playerId 
                  ? { ...player, score: player.score + invader.points }
                  : player
              );
            }
          }
        });
      });
      
      // Check invader shots against players
      newShots.forEach(shot => {
        if (!shot.active || shot.direction !== 'down') return;
        
        newPlayers.forEach(player => {
          if (!player.active) return;
          
          if (isColliding(shot, player)) {
            shot.active = false;
            player.lives -= 1;
            player.active = player.lives > 0;
            
            if (newPlayers.every(p => !p.active)) {
              gameOver = true;
            }
          }
        });
      });
      
      // Check shots against bunkers
      newBunkers = newBunkers.map(bunker => {
        const newGrid = [...bunker.grid.map(row => [...row])];
        let bunkerHit = false;
        
        newShots.forEach(shot => {
          if (!shot.active) return;
          
          if (isColliding(shot, bunker)) {
            const gridX = Math.floor((shot.x - bunker.x) / SHOT_WIDTH);
            const gridY = Math.floor((shot.y - bunker.y) / SHOT_HEIGHT);
            
            if (
              gridY >= 0 && gridY < newGrid.length &&
              gridX >= 0 && gridX < newGrid[0].length &&
              newGrid[gridY][gridX]
            ) {
              newGrid[gridY][gridX] = false;
              shot.active = false;
              bunkerHit = true;
            }
          }
        });
        
        return {
          ...bunker,
          grid: newGrid
        };
      });
      
      // Filter out inactive shots, invaders
      newShots = newShots.filter(shot => shot.active);
      newInvaders = newInvaders.filter(invader => invader.active);
      
      // Check if all invaders are destroyed to trigger next wave
      if (newInvaders.length === 0 && !gameOver) {
        return {
          ...state,
          shots: [],
          invaders: createInvaders(state.wave + 1),
          players: newPlayers,
          bunkers: createBunkers(),
          wave: state.wave + 1,
          isGameOver: gameOver
        };
      }
      
      return {
        ...state,
        shots: newShots,
        invaders: newInvaders,
        players: newPlayers,
        bunkers: newBunkers,
        isGameOver: gameOver
      };
    }

    default:
      return state;
  }
}