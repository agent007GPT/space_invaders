// Define pixel-based shapes for game elements

// Player ship 1 (left side of screen)
export const getPlayerShape = (playerNumber: 1 | 2): boolean[][] => {
  // Player 1 shape - simple triangle with a base
  if (playerNumber === 1) {
    return [
      [false, false, false, false, false, true, false, false, false, false, false],
      [false, false, false, false, true, true, true, false, false, false, false],
      [false, false, false, true, true, true, true, true, false, false, false],
      [false, false, true, true, true, true, true, true, true, false, false],
      [false, true, true, true, true, true, true, true, true, true, false],
      [true, true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true, true]
    ];
  }
  
  // Player 2 shape - slightly different shape
  return [
    [false, false, false, false, true, true, true, false, false, false, false],
    [false, false, false, true, true, true, true, true, false, false, false],
    [false, false, true, true, true, true, true, true, true, false, false],
    [false, true, true, true, true, true, true, true, true, true, false],
    [true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true],
    [true, true, false, true, true, true, true, true, false, true, true],
    [true, false, false, true, true, true, true, true, false, false, true]
  ];
};

// Invader shapes (three different styles)
export const getInvaderShape = (type: number): boolean[][] => {
  // Type 0 (top rows) - classic space invader shape
  if (type === 0) {
    return [
      [false, false, true, false, false, false, false, true, false, false],
      [false, false, false, true, false, false, true, false, false, false],
      [false, false, true, true, true, true, true, true, false, false],
      [false, true, true, false, true, true, false, true, true, false],
      [true, true, true, true, true, true, true, true, true, true],
      [true, false, true, true, true, true, true, true, false, true],
      [true, false, true, false, false, false, false, true, false, true],
      [false, false, false, true, true, true, true, false, false, false]
    ];
  }
  
  // Type 1 (middle rows) - squid-like shape
  if (type === 1) {
    return [
      [false, false, false, true, true, true, true, false, false, false],
      [false, true, true, true, true, true, true, true, true, false],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, false, false, false, false, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [false, false, true, true, false, false, true, true, false, false],
      [false, true, true, false, true, true, false, true, true, false],
      [true, false, false, false, false, false, false, false, false, true]
    ];
  }
  
  // Type 2 (bottom rows) - crab-like shape
  return [
    [false, false, true, true, false, false, false, true, true, false],
    [false, true, true, true, true, true, true, true, true, false],
    [true, true, true, true, true, true, true, true, true, true],
    [true, true, true, false, false, false, false, true, true, true],
    [true, true, true, true, true, true, true, true, true, true],
    [false, false, false, true, true, true, true, false, false, false],
    [false, false, true, true, false, false, true, true, false, false],
    [true, true, false, false, false, false, false, false, true, true]
  ];
};