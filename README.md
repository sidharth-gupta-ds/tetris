# Tetris Game

A complete Tetris implementation built with TypeScript and HTML5 Canvas.

## Features

- **Classic Tetris Gameplay**: All 7 standard Tetromino pieces (I, O, T, S, Z, J, L)
- **Smooth Controls**: Responsive keyboard input with key repeat
- **Ghost Piece**: Shows where the current piece will land
- **Line Clearing**: Full rows are cleared with scoring
- **Level Progression**: Speed increases as you clear more lines
- **Next Piece Preview**: See what piece is coming next
- **Pause/Resume**: Press P to pause the game
- **Game Over & Restart**: Press R to restart when game ends

## Controls

- **← →**: Move piece left/right
- **↓**: Soft drop (move down faster)
- **↑**: Rotate piece
- **Space**: Hard drop (instantly drop to bottom)
- **P**: Pause/Resume game
- **R**: Restart game (when game over)

## Scoring System

- **Single line**: 40 × (level + 1) points
- **Double lines**: 100 × (level + 1) points  
- **Triple lines**: 300 × (level + 1) points
- **Tetris (4 lines)**: 1200 × (level + 1) points
- **Hard drop**: 2 points per cell dropped

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Game

```bash
npm run dev
```

This will start a development server at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Project Structure

```
src/
├── main.ts          # Entry point
├── TetrisGame.ts    # Main game class
├── Board.ts         # Game board logic
├── Piece.ts         # Tetromino piece class
├── Renderer.ts      # Canvas rendering
├── InputHandler.ts  # Keyboard input handling
├── tetrominoes.ts   # Piece definitions
└── types.ts         # TypeScript type definitions
```

## Game Design

### Architecture

The game follows a modular architecture with clear separation of concerns:

1. **TetrisGame**: Main game controller that orchestrates all components
2. **Board**: Manages the game grid, collision detection, and line clearing
3. **Piece**: Represents individual Tetromino pieces with rotation and movement
4. **Renderer**: Handles all canvas drawing operations
5. **InputHandler**: Manages keyboard input with proper key repeat handling

### Key Features

- **Collision Detection**: Proper boundary and piece collision checking
- **Wall Kicks**: Smart rotation that attempts to move pieces away from walls
- **Ghost Piece**: Visual guide showing where pieces will land
- **Progressive Difficulty**: Speed increases with level progression
- **Responsive Design**: Works on desktop and mobile devices

## License

MIT License - feel free to use this code for learning or your own projects!
