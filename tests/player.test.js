import { Player } from '../src/player.js';
import { Ship } from '../src/ship.js';

describe('Player', () => {
  test('should create a player with a gameboard', () => {
    const player = new Player('human');
    expect(player.gameboard).toBeDefined();
    expect(player.type).toBe('human');
  });

  test('should create a computer player', () => {
    const player = new Player('computer');
    expect(player.type).toBe('computer');
    expect(player.gameboard).toBeDefined();
  });

  test('human player should be able to attack enemy gameboard', () => {
    const player = new Player('human');
    const enemy = new Player('computer');
    
    const ship = new Ship(3);
    enemy.gameboard.placeShip(ship, 0, 0, 'horizontal');
    
    const result = player.attack(enemy.gameboard, 0, 0);
    expect(result).toBe('hit');
  });

  test('computer player should make random attacks', () => {
    const computer = new Player('computer');
    const enemy = new Player('human');
    
    const attack = computer.makeRandomAttack(enemy.gameboard);
    expect(['hit', 'miss']).toContain(attack.result);
    expect(typeof attack.row).toBe('number');
    expect(typeof attack.col).toBe('number');
  });

  test('computer should not attack the same coordinate twice', () => {
    const computer = new Player('computer');
    const enemy = new Player('human');
    
    // Make multiple attacks to test duplicate prevention
    const attackedCoordinates = new Set();
    
    for (let i = 0; i < 10; i++) {
      const attack = computer.makeRandomAttack(enemy.gameboard);
      const coordString = `${attack.row},${attack.col}`;
      expect(attackedCoordinates.has(coordString)).toBe(false);
      attackedCoordinates.add(coordString);
    }
  });

  test('computer should return null when no valid moves left', () => {
    const computer = new Player('computer');
    const enemy = new Player('human');
    
    // Attack all positions
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        enemy.gameboard.receiveAttack(row, col);
      }
    }
    
    const result = computer.makeRandomAttack(enemy.gameboard);
    expect(result).toBe(null);
  });
});