import { Ship } from '../src/ship.js';

describe('Ship', () => {
  test('should create a ship with specified length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
  });

  test('should initialize with zero hits', () => {
    const ship = new Ship(4);
    expect(ship.hits).toBe(0);
  });

  test('should not be sunk when created', () => {
    const ship = new Ship(2);
    expect(ship.isSunk()).toBe(false);
  });

  test('should increase hits when hit() is called', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
    
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test('should be sunk when hits equal length', () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('should not be sunk when hits are less than length', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test('should handle multiple hits beyond length', () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    ship.hit(); // Extra hit
    expect(ship.hits).toBe(3);
    expect(ship.isSunk()).toBe(true);
  });
});