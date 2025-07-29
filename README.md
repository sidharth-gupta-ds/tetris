# Tetris Game

A complete Tetris implementation built with TypeScript and HTML5 Canvas.

## 🎮 **Live Demo**
Deploy this project to Vercel using the instructions below!

## Features

- **Classic Tetris Gameplay**: All 7 standard Tetromino pieces (I, O, T, S, Z, J, L)
- **Smooth Controls**: Responsive keyboard input with single-tap and hold-to-repeat
- **Ghost Piece**: Shows where the current piece will land
- **Line Clearing**: Full rows are cleared with scoring
- **Level Progression**: Speed increases as you clear more lines
- **Next Piece Preview**: See what piece is coming next
- **Pause/Resume**: Press P to pause the game
- **Game Over & Restart**: Press R to restart when game ends

## Controls

- **← →**: Move piece left/right (single tap or hold)
- **↓**: Soft drop (move down faster)
- **↑**: Rotate piece
- **Space**: Hard drop (instantly drop to bottom)
- **P**: Pause/Resume game
- **R**: Restart game (when game over)

## 🚀 **Quick Deployment to Vercel**

### Method 1: Using Vercel CLI (Recommended)

1. **Login to Vercel:**
```bash
conda activate stable
vercel login
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? (choose your account)
   - Link to existing project? **No**
   - What's your project's name? **tetris-game**
   - In which directory is your code located? **./

### Method 2: Using GitHub + Vercel Dashboard

1. **Push to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/tetris-game.git
git branch -M main
git push -u origin main
```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your tetris-game repository
   - Click "Deploy"

### Method 3: Using the Deploy Script

```bash
./deploy.sh
```

## 📦 **Local Development**

### Prerequisites

- Node.js (v16 or higher) - Install via conda: `conda install nodejs -c conda-forge`
- npm (comes with Node.js)

### Installation

```bash
# Activate your conda environment
conda activate stable

# Install dependencies
npm install
```

### Running the Game

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 **Project Structure**

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

Configuration Files:
├── vercel.json      # Vercel deployment config
├── vite.config.js   # Vite build configuration
├── tsconfig.json    # TypeScript configuration
└── deploy.sh        # Deployment script
```

## 🎯 **Scoring System**

- **Single line**: 40 × (level + 1) points
- **Double lines**: 100 × (level + 1) points  
- **Triple lines**: 300 × (level + 1) points
- **Tetris (4 lines)**: 1200 × (level + 1) points
- **Hard drop**: 2 points per cell dropped

## 🛠 **Technical Features**

### Input System
- **Single-tap movement**: Press once for precise control
- **Hold-to-repeat**: 250ms delay, then 120ms intervals
- **Separate timing**: Different rates for different actions

### Game Architecture
- **Modular design**: Clear separation of concerns
- **Collision detection**: Proper boundary and piece collision
- **Wall kicks**: Smart rotation with wall avoidance
- **Progressive difficulty**: Speed increases with levels

## 🌐 **Deployment Features**

- ✅ **Optimized build** with Vite
- ✅ **Vercel configuration** ready
- ✅ **Git repository** initialized
- ✅ **Production minification**
- ✅ **Responsive design**

## 🐛 **Troubleshooting**

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Test local build
npm run build
```

### Deployment Issues
- Ensure you're logged into Vercel: `vercel login`
- Check that build completes locally: `npm run build`
- Verify all files are committed to Git

## 📄 **License**

MIT License - feel free to use this code for learning or your own projects!

---

**Ready to deploy?** Run `vercel login` then `vercel --prod` to get your game live on the web! 🎮
