# 🚢 Battleship Game

A classic Battleship game built with vanilla JavaScript using Test-Driven Development. This is an assignment from [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship).

## Features

- Interactive ship placement with rotation
- Turn-based combat against computer
- Visual feedback for hits, misses, and sunk ships
- Responsive design for desktop and mobile
- 25 comprehensive tests covering all functionality

## Quick Start

```bash
npm install
npm test          # Run tests
npm run dev       # Start development server
```

Open `http://127.0.0.1:3000` to play.

## How to Play

1. **Place Ships**: Click on your board to place all 5 ships
2. **Rotate**: Use the "Rotate" button to change orientation
3. **Attack**: Click on enemy board to attack
4. **Win**: Sink all enemy ships first!

## Tech Stack

- JavaScript (ES6+)
- HTML5 & CSS3
- Jest for testing
- Live-server for development

## Project Structure

```
src/
├── ship.js           # Ship class
├── gameboard.js      # Game board logic
├── player.js         # Player implementation
├── gameController.js # Main game controller
└── index.js          # Entry point

tests/               # Jest test files
```
