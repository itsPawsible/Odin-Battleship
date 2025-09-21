class Player {
  constructor(type) {
    this.type = type; // 'human' or 'computer'
    this.gameboard = new Gameboard();
  }

  attack(enemyGameboard, row, col) {
    return enemyGameboard.receiveAttack(row, col);
  }

  makeRandomAttack(enemyGameboard) {
    const availableCoordinates = [];
    
    // Find all available coordinates
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const coordinate = `${row},${col}`;
        if (!enemyGameboard.attackedCoordinates.has(coordinate)) {
          availableCoordinates.push({ row, col });
        }
      }
    }
    
    // Return null if no valid moves left
    if (availableCoordinates.length === 0) {
      return null;
    }
    
    // Pick a random coordinate
    const randomIndex = Math.floor(Math.random() * availableCoordinates.length);
    const { row, col } = availableCoordinates[randomIndex];
    
    // Make the attack
    const result = this.attack(enemyGameboard, row, col);
    
    // Return both the result and coordinates for testing
    return { result, row, col };
  }
}