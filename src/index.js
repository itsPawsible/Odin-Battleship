console.log('JavaScript file loaded!');

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing game...');
  try {
    const game = new GameController();
    console.log('GameController created');
    game.initializeGame();
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Error initializing game:', error);
  }
});