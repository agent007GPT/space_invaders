// Game dimensions
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const PIXEL_SIZE = 3;

// Game elements sizes
export const PLAYER_WIDTH = 13 * PIXEL_SIZE;
export const PLAYER_HEIGHT = 8 * PIXEL_SIZE;
export const INVADER_WIDTH = 11 * PIXEL_SIZE;
export const INVADER_HEIGHT = 8 * PIXEL_SIZE;
export const BUNKER_WIDTH = 24 * PIXEL_SIZE;
export const BUNKER_HEIGHT = 18 * PIXEL_SIZE;
export const SHOT_WIDTH = 1 * PIXEL_SIZE;
export const SHOT_HEIGHT = 4 * PIXEL_SIZE;

// Game speeds
export const PLAYER_SPEED = 5;
export const PLAYER_SHOT_SPEED = 7;
export const INVADER_SHOT_SPEED = 3;
export const INITIAL_INVADER_SPEED = 1;
export const MAX_INVADER_SPEED = 5;
export const INVADER_DROP_DISTANCE = 10;

// Game timing (in milliseconds)
export const FRAME_RATE = 1000 / 60; // 60 FPS
export const INVADER_MOVE_INTERVAL = 500; // Move every 500ms initially
export const INVADER_SHOOTING_CHANCE = 0.005; // 0.5% chance of shooting per frame per invader

// Game setup
export const INVADER_ROWS = 5;
export const INVADER_COLS = 11;
export const INVADER_ROW_GAP = 15;
export const INVADER_COL_GAP = 15;
export const BUNKER_COUNT = 4;
export const INITIAL_LIVES = 3;

// Points
export const INVADER_POINTS = {
  0: 30, // Top row
  1: 20, // Second row
  2: 20, // Third row
  3: 10, // Fourth row
  4: 10, // Bottom row
};

// Colors
export const MATRIX_GREEN = '#00ff00';
export const MATRIX_BLACK = '#000000';
export const MATRIX_DARK_GREEN = '#007700';

// Controls
export const CONTROLS = {
  PLAYER1: {
    LEFT: 'a',
    RIGHT: 'd',
    FIRE: 'w',
  },
  PLAYER2: {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    FIRE: 'ArrowUp',
  },
};

// Game boundaries for invaders
export const INVADER_BOUNDARY_PADDING = 20;
export const GAME_OVER_LINE = GAME_HEIGHT - PLAYER_HEIGHT - 30;