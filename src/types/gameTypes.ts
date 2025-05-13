export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameObject extends Position, Size {
  id: string;
  active: boolean;
}

export interface Player extends GameObject {
  lives: number;
  canShoot: boolean;
  playerNumber: 1 | 2;
  score: number;
}

export interface Invader extends GameObject {
  points: number;
  row: number;
  col: number;
}

export interface Shot extends GameObject {
  playerId?: string;
  invaderId?: string;
  direction: 'up' | 'down';
}

export interface Bunker extends GameObject {
  grid: boolean[][];
}

export interface GameState {
  players: Player[];
  invaders: Invader[];
  shots: Shot[];
  bunkers: Bunker[];
  wave: number;
  isGameOver: boolean;
  isStarted: boolean;
  isPaused: boolean;
  isSinglePlayer: boolean;
}

export type GameAction =
  | { type: 'MOVE_PLAYER'; payload: { playerId: string; direction: 'left' | 'right' } }
  | { type: 'PLAYER_SHOOT'; payload: { playerId: string } }
  | { type: 'INVADER_SHOOT'; payload: { invaderId: string } }
  | { type: 'MOVE_SHOTS' }
  | { type: 'MOVE_INVADERS'; payload: { direction: 'left' | 'right' | 'down' } }
  | { type: 'CHECK_COLLISIONS' }
  | { type: 'PLAYER_HIT'; payload: { playerId: string } }
  | { type: 'INVADER_HIT'; payload: { invaderId: string; shotId: string } }
  | { type: 'BUNKER_HIT'; payload: { bunkerId: string; position: Position; shotId: string } }
  | { type: 'REMOVE_SHOT'; payload: { shotId: string } }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'NEXT_WAVE' }
  | { type: 'SET_SINGLE_PLAYER'; payload: { isSinglePlayer: boolean } };