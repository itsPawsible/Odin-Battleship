import { Gameboard } from '../src/gameboard.js';
import { Ship } from '../src/ship.js';

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('should create a 10x10 gameboard', () => {
    expect(gameboard.board.length).toBe(10);
    expect(gameboard.board[0].length).toBe(10);
  });

  test('should place a ship horizontally', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, 0, 0, 'horizontal');
    
    expect(gameboard.board[0][0]).toBe(ship);
    expect(gameboard.board[0][1]).toBe(ship);
    expect(gameboard.board[0][2]).toBe(ship);
  });

  test('should place a ship vertically', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, 0, 0, 'vertical');
    
    expect(gameboard.board[0][0]).toBe(ship);
    expect(gameboard.board[1][0]).toBe(ship);
    expect(gameboard.board[2][0]).toBe(ship);
  });

  test('should not place ship if it goes out of bounds horizontally', () => {
    const ship = new Ship(3);
    const result = gameboard.placeShip(ship, 0, 8, 'horizontal');
    
    expect(result).toBe(false);
    expect(gameboard.board[0][8]).toBe(null);
  });

  test('should not place ship if it goes out of bounds vertically', () => {
    const ship = new Ship(3);
    const result = gameboard.placeShip(ship, 8, 0, 'vertical');
    
    expect(result).toBe(false);
    expect(gameboard.board[8][0]).toBe(null);
  });

  test('should not place ship if position is occupied', () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(2);
    
    gameboard.placeShip(ship1, 0, 0, 'horizontal');
    const result = gameboard.placeShip(ship2, 0, 1, 'horizontal');
    
    expect(result).toBe(false);
  });

  test('should receive attack and hit a ship', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, 0, 0, 'horizontal');
    
    const result = gameboard.receiveAttack(0, 0);
    
    expect(result).toBe('hit');
    expect(ship.hits).toBe(1);
  });

  test('should receive attack and miss', () => {
    const result = gameboard.receiveAttack(0, 0);
    
    expect(result).toBe('miss');
    expect(gameboard.missedAttacks).toContainEqual([0, 0]);
  });

  test('should not allow attacking the same coordinate twice', () => {
    gameboard.receiveAttack(0, 0);
    const result = gameboard.receiveAttack(0, 0);
    
    expect(result).toBe('already attacked');
  });

  test('should track missed attacks', () => {
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(1, 1);
    
    expect(gameboard.missedAttacks).toContainEqual([0, 0]);
    expect(gameboard.missedAttacks).toContainEqual([1, 1]);
    expect(gameboard.missedAttacks.length).toBe(2);
  });

  test('should report when all ships are sunk', () => {
    const ship1 = new Ship(2);
    const ship2 = new Ship(1);
    
    gameboard.placeShip(ship1, 0, 0, 'horizontal');
    gameboard.placeShip(ship2, 1, 0, 'horizontal');
    
    // Sink ship1
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    
    // Sink ship2
    gameboard.receiveAttack(1, 0);
    
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test('should report when not all ships are sunk', () => {
    const ship1 = new Ship(2);
    const ship2 = new Ship(1);
    
    gameboard.placeShip(ship1, 0, 0, 'horizontal');
    gameboard.placeShip(ship2, 1, 0, 'horizontal');
    
    // Only hit ship1 once
    gameboard.receiveAttack(0, 0);
    
    expect(gameboard.allShipsSunk()).toBe(false);
  });
});