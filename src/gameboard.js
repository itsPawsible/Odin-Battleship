class Gameboard {
  constructor() {
    this.board = this.createBoard();
    this.ships = [];
    this.missedAttacks = [];
    this.attackedCoordinates = new Set();
  }

  createBoard() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      board[i] = new Array(10).fill(null);
    }
    return board;
  }

  placeShip(ship, row, col, orientation) {
    // Check if ship can be placed
    if (!this.canPlaceShip(ship, row, col, orientation)) {
      return false;
    }

    // Place the ship
    if (orientation === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        this.board[row][col + i] = ship;
      }
    } else if (orientation === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        this.board[row + i][col] = ship;
      }
    }

    this.ships.push(ship);
    return true;
  }

  canPlaceShip(ship, row, col, orientation) {
    // Check bounds
    if (orientation === 'horizontal') {
      if (col + ship.length > 10) return false;
    } else if (orientation === 'vertical') {
      if (row + ship.length > 10) return false;
    }

    // Check if positions are occupied
    if (orientation === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        if (this.board[row][col + i] !== null) return false;
      }
    } else if (orientation === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        if (this.board[row + i][col] !== null) return false;
      }
    }

    return true;
  }

  receiveAttack(row, col) {
    const coordinate = `${row},${col}`;
    
    // Check if already attacked
    if (this.attackedCoordinates.has(coordinate)) {
      return 'already attacked';
    }

    this.attackedCoordinates.add(coordinate);

    // Check if there's a ship at this position
    const target = this.board[row][col];
    
    if (target) {
      // Hit a ship
      target.hit();
      return 'hit';
    } else {
      // Miss
      this.missedAttacks.push([row, col]);
      return 'miss';
    }
  }

  allShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }
}