import { TetrisGame } from './TetrisGame.js';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new TetrisGame();
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        game.destroy();
    });
});

// Prevent default behavior for arrow keys and space
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
});
