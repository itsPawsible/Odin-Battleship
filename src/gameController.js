class GameController {
  constructor() {
    this.player = new Player('human');
    this.computer = new Player('computer');
    this.currentPlayer = this.player;
    this.gamePhase = 'placement'; // 'placement', 'battle', 'gameOver'
    this.ships = [
      { name: 'Carrier', length: 5 },
      { name: 'Battleship', length: 4 },
      { name: 'Cruiser', length: 3 },
      { name: 'Submarine', length: 3 },
      { name: 'Destroyer', length: 2 }
    ];
    this.currentShipIndex = 0;
    this.currentOrientation = 'horizontal';
    this.gameOver = false;
  }

  initializeGame() {
    this.setupComputerShips();
    this.renderBoards();
    this.setupEventListeners();
    this.updateShipPlacementUI();
  }

  setupComputerShips() {
    // Place computer ships randomly
    this.ships.forEach(shipData => {
      let placed = false;
      while (!placed) {
        const ship = new Ship(shipData.length);
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        
        if (this.computer.gameboard.placeShip(ship, row, col, orientation)) {
          placed = true;
        }
      }
    });
  }

  renderBoards() {
    this.renderPlayerBoard();
    this.renderEnemyBoard();
  }

  renderPlayerBoard() {
    const playerBoard = document.getElementById('player-board');
    playerBoard.innerHTML = '';
    
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        const boardCell = this.player.gameboard.board[row][col];
        if (boardCell) {
          cell.classList.add('ship');
        }
        
        // Check if cell was attacked
        const coordinate = `${row},${col}`;
        if (this.player.gameboard.attackedCoordinates.has(coordinate)) {
          if (boardCell) {
            cell.classList.add(boardCell.isSunk() ? 'sunk' : 'hit');
          } else {
            cell.classList.add('miss');
          }
        }
        
        playerBoard.appendChild(cell);
      }
    }
  }

  renderEnemyBoard() {
    const enemyBoard = document.getElementById('enemy-board');
    enemyBoard.innerHTML = '';
    
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        const boardCell = this.computer.gameboard.board[row][col];
        
        // Check if cell was attacked
        const coordinate = `${row},${col}`;
        if (this.computer.gameboard.attackedCoordinates.has(coordinate)) {
          if (boardCell) {
            cell.classList.add(boardCell.isSunk() ? 'sunk' : 'hit');
          } else {
            cell.classList.add('miss');
          }
        }
        
        enemyBoard.appendChild(cell);
      }
    }
  }

  setupEventListeners() {
    // Enemy board click for attacks
    document.getElementById('enemy-board').addEventListener('click', (e) => {
      if (e.target.classList.contains('cell') && this.gamePhase === 'battle' && !this.gameOver) {
        this.handlePlayerAttack(e.target);
      }
    });

    // Player board click for ship placement
    document.getElementById('player-board').addEventListener('click', (e) => {
      if (e.target.classList.contains('cell') && this.gamePhase === 'placement') {
        this.handleShipPlacement(e.target);
      }
    });

    // Rotate button
    document.getElementById('rotate-btn').addEventListener('click', () => {
      this.currentOrientation = this.currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
      this.updateOrientationDisplay();
    });

    // New game button
    document.getElementById('new-game-btn').addEventListener('click', () => {
      this.resetGame();
    });
  }

  handleShipPlacement(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    if (this.currentShipIndex < this.ships.length) {
      const shipData = this.ships[this.currentShipIndex];
      const ship = new Ship(shipData.length);
      
      if (this.player.gameboard.placeShip(ship, row, col, this.currentOrientation)) {
        this.currentShipIndex++;
        this.renderPlayerBoard();
        
        if (this.currentShipIndex >= this.ships.length) {
          this.startBattle();
        } else {
          this.updateShipPlacementUI();
        }
      }
    }
  }

  handlePlayerAttack(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    const result = this.player.attack(this.computer.gameboard, row, col);
    
    if (result !== 'already attacked') {
      this.renderEnemyBoard();
      this.updateGameMessage(`You ${result}!`);
      
      if (this.computer.gameboard.allShipsSunk()) {
        this.endGame('You Win! 🎉');
        return;
      }
      
      // Computer's turn
      setTimeout(() => {
        this.handleComputerAttack();
      }, 1000);
    }
  }

  handleComputerAttack() {
    const attack = this.computer.makeRandomAttack(this.player.gameboard);
    
    if (attack) {
      this.renderPlayerBoard();
      this.updateGameMessage(`Computer ${attack.result}!`);
      
      if (this.player.gameboard.allShipsSunk()) {
        this.endGame('Computer Wins! 💻');
        return;
      }
      
      this.updateGameMessage('Your turn! Click on the enemy board to attack.');
    }
  }

  startBattle() {
    this.gamePhase = 'battle';
    document.getElementById('ship-placement').classList.add('hidden');
    document.getElementById('enemy-board').classList.add('clickable');
    this.updateGameMessage('Battle begins! Click on the enemy board to attack.');
  }

  updateShipPlacementUI() {
    if (this.currentShipIndex < this.ships.length) {
      const shipData = this.ships[this.currentShipIndex];
      document.getElementById('current-ship').textContent = 
        `${shipData.name} (${shipData.length} spaces)`;
    }
    this.updateOrientationDisplay();
  }

  updateOrientationDisplay() {
    document.getElementById('orientation-display').textContent = 
      this.currentOrientation.charAt(0).toUpperCase() + this.currentOrientation.slice(1);
  }

  updateGameMessage(message) {
    document.getElementById('game-message').textContent = message;
  }

  endGame(message) {
    this.gameOver = true;
    this.gamePhase = 'gameOver';
    
    // Create game over overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    overlay.innerHTML = `
      <div class="game-over-content">
        <h2>${message}</h2>
        <p>Thanks for playing!</p>
        <button onclick="location.reload()">Play Again</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  resetGame() {
    location.reload();
  }
}