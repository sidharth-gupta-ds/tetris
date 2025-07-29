import { Board } from './Board.js';
import { Piece } from './Piece.js';
import { InputHandler } from './InputHandler.js';
import { Renderer } from './Renderer.js';
import { GameState } from './types.js';
import { TETROMINO_TYPES } from './tetrominoes.js';

export class TetrisGame {
    private board: Board;
    private currentPiece: Piece | null = null;
    private nextPiece: Piece | null = null;
    private inputHandler: InputHandler;
    private renderer: Renderer;
    private gameState: GameState;
    
    private dropTimer: number = 0;
    private dropInterval: number = 1000; // milliseconds
    private lastTime: number = 0;
    private animationId: number = 0;

    // UI elements
    private scoreElement: HTMLElement;
    private levelElement: HTMLElement;
    private linesElement: HTMLElement;
    private pauseOverlay: HTMLElement;
    private gameOverOverlay: HTMLElement;

    constructor() {
        this.board = new Board();
        this.inputHandler = new InputHandler();
        
        // Get canvas elements
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        const nextCanvas = document.getElementById('next-canvas') as HTMLCanvasElement;
        
        if (!canvas || !nextCanvas) {
            throw new Error('Canvas elements not found');
        }
        
        this.renderer = new Renderer(canvas, nextCanvas);
        
        // Get UI elements
        this.scoreElement = document.getElementById('score')!;
        this.levelElement = document.getElementById('level')!;
        this.linesElement = document.getElementById('lines')!;
        this.pauseOverlay = document.getElementById('pause-overlay')!;
        this.gameOverOverlay = document.getElementById('game-over-overlay')!;
        
        this.gameState = {
            score: 0,
            level: 1,
            lines: 0,
            isPaused: false,
            isGameOver: false
        };
        
        this.init();
    }

    private init(): void {
        this.spawnNewPiece();
        this.updateUI();
        this.gameLoop(0);
    }

    private spawnNewPiece(): void {
        if (this.nextPiece) {
            this.currentPiece = this.nextPiece;
            this.currentPiece.position = { x: 3, y: 0 };
        } else {
            this.currentPiece = this.generateRandomPiece();
        }
        
        this.nextPiece = this.generateRandomPiece();
        
        // Check for game over
        if (!this.board.isValidPosition(this.currentPiece)) {
            this.gameState.isGameOver = true;
        }
    }

    private generateRandomPiece(): Piece {
        const randomType = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
        return new Piece(randomType);
    }

    private gameLoop(currentTime: number): void {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update input handler to handle key repeat timing
        this.inputHandler.update();
        
        this.handleInput();
        
        if (!this.gameState.isPaused && !this.gameState.isGameOver) {
            this.update(deltaTime);
        }
        
        this.render();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    private handleInput(): void {
        const controls = this.inputHandler.getControls();
        
        // Handle pause
        if (controls.pause !== this.gameState.isPaused) {
            this.gameState.isPaused = controls.pause;
        }
        
        // Handle restart
        if (controls.restart && this.gameState.isGameOver) {
            this.restart();
        }
        
        if (this.gameState.isPaused || this.gameState.isGameOver || !this.currentPiece) {
            return;
        }
        
        // Handle movement
        if (controls.left) {
            this.movePiece(-1, 0);
        }
        if (controls.right) {
            this.movePiece(1, 0);
        }
        if (controls.down) {
            this.movePiece(0, 1);
        }
        if (controls.up) {
            this.rotatePiece();
        }
        if (controls.space) {
            this.hardDrop();
        }
        
        this.inputHandler.resetOneTimeControls();
    }

    private update(deltaTime: number): void {
        if (!this.currentPiece) return;
        
        this.dropTimer += deltaTime;
        
        if (this.dropTimer >= this.dropInterval) {
            this.dropTimer = 0;
            
            if (!this.movePiece(0, 1)) {
                this.lockPiece();
            }
        }
    }

    private movePiece(dx: number, dy: number): boolean {
        if (!this.currentPiece) return false;
        
        const movedPiece = this.currentPiece.move(dx, dy);
        
        if (this.board.isValidPosition(movedPiece)) {
            this.currentPiece = movedPiece;
            return true;
        }
        
        return false;
    }

    private rotatePiece(): boolean {
        if (!this.currentPiece) return false;
        
        const rotatedPiece = this.currentPiece.rotate();
        
        // Try basic rotation
        if (this.board.isValidPosition(rotatedPiece)) {
            this.currentPiece = rotatedPiece;
            return true;
        }
        
        // Try wall kicks
        const kicks = [
            { x: -1, y: 0 }, { x: 1, y: 0 },
            { x: 0, y: -1 }, { x: -2, y: 0 }, { x: 2, y: 0 }
        ];
        
        for (const kick of kicks) {
            const kickedPiece = rotatedPiece.move(kick.x, kick.y);
            if (this.board.isValidPosition(kickedPiece)) {
                this.currentPiece = kickedPiece;
                return true;
            }
        }
        
        return false;
    }

    private hardDrop(): void {
        if (!this.currentPiece) return;
        
        let dropDistance = 0;
        while (this.movePiece(0, 1)) {
            dropDistance++;
        }
        
        this.gameState.score += dropDistance * 2;
        this.lockPiece();
    }

    private lockPiece(): void {
        if (!this.currentPiece) return;
        
        this.board.placePiece(this.currentPiece);
        
        const linesCleared = this.board.clearLines();
        this.updateScore(linesCleared);
        
        if (this.board.isGameOver()) {
            this.gameState.isGameOver = true;
        } else {
            this.spawnNewPiece();
        }
    }

    private updateScore(linesCleared: number): void {
        if (linesCleared > 0) {
            this.gameState.lines += linesCleared;
            
            // Scoring system
            const baseScore = [0, 40, 100, 300, 1200][linesCleared];
            this.gameState.score += baseScore * (this.gameState.level + 1);
            
            // Level progression
            const newLevel = Math.floor(this.gameState.lines / 10) + 1;
            if (newLevel > this.gameState.level) {
                this.gameState.level = newLevel;
                this.dropInterval = Math.max(50, 1000 - (this.gameState.level - 1) * 50);
            }
        }
    }

    private render(): void {
        this.renderer.clear();
        this.renderer.drawGrid();
        this.renderer.drawBoard(this.board);
        
        if (this.currentPiece) {
            // Draw ghost piece
            const ghostPiece = this.board.getGhostPiecePosition(this.currentPiece);
            this.renderer.drawGhostPiece(ghostPiece);
            
            // Draw current piece
            this.renderer.drawPiece(this.currentPiece);
        }
        
        if (this.nextPiece) {
            this.renderer.drawNextPiece(this.nextPiece);
        }
        
        this.updateUI();
    }

    private updateUI(): void {
        this.scoreElement.textContent = this.gameState.score.toString();
        this.levelElement.textContent = this.gameState.level.toString();
        this.linesElement.textContent = this.gameState.lines.toString();
        
        this.pauseOverlay.classList.toggle('hidden', !this.gameState.isPaused);
        this.gameOverOverlay.classList.toggle('hidden', !this.gameState.isGameOver);
    }

    private restart(): void {
        this.board.clear();
        this.gameState = {
            score: 0,
            level: 1,
            lines: 0,
            isPaused: false,
            isGameOver: false
        };
        this.dropInterval = 1000;
        this.dropTimer = 0;
        this.currentPiece = null;
        this.nextPiece = null;
        this.spawnNewPiece();
    }

    public destroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
