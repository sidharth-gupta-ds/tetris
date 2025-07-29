import { Piece } from './Piece.js';

export class Board {
    public width: number;
    public height: number;
    public grid: (string | null)[][];

    constructor(width: number = 10, height: number = 20) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill(null).map(() => Array(width).fill(null));
    }

    isValidPosition(piece: Piece): boolean {
        const blocks = piece.getBlocks();
        
        for (const block of blocks) {
            // Check bounds
            if (block.x < 0 || block.x >= this.width || 
                block.y < 0 || block.y >= this.height) {
                return false;
            }
            
            // Check collision with existing blocks
            if (this.grid[block.y][block.x] !== null) {
                return false;
            }
        }
        
        return true;
    }

    placePiece(piece: Piece): void {
        const blocks = piece.getBlocks();
        
        for (const block of blocks) {
            if (block.y >= 0 && block.y < this.height && 
                block.x >= 0 && block.x < this.width) {
                this.grid[block.y][block.x] = piece.color;
            }
        }
    }

    clearLines(): number {
        let linesCleared = 0;
        
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== null)) {
                // Remove the full line
                this.grid.splice(y, 1);
                // Add a new empty line at the top
                this.grid.unshift(Array(this.width).fill(null));
                linesCleared++;
                y++; // Check the same row again since we shifted everything down
            }
        }
        
        return linesCleared;
    }

    isGameOver(): boolean {
        // Check if any block in the top row is filled
        return this.grid[0].some(cell => cell !== null);
    }

    clear(): void {
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(null));
    }

    getGhostPiecePosition(piece: Piece): Piece {
        let ghostPiece = piece.clone();
        
        while (this.isValidPosition(ghostPiece)) {
            ghostPiece = ghostPiece.move(0, 1);
        }
        
        return ghostPiece.move(0, -1);
    }
}
