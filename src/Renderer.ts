import { Board } from './Board.js';
import { Piece } from './Piece.js';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private nextCanvas: HTMLCanvasElement;
    private nextCtx: CanvasRenderingContext2D;
    private blockSize: number;

    constructor(canvas: HTMLCanvasElement, nextCanvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.nextCanvas = nextCanvas;
        
        const ctx = canvas.getContext('2d');
        const nextCtx = nextCanvas.getContext('2d');
        
        if (!ctx || !nextCtx) {
            throw new Error('Could not get canvas context');
        }
        
        this.ctx = ctx;
        this.nextCtx = nextCtx;
        this.blockSize = canvas.width / 10; // 10 blocks wide
    }

    clear(): void {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.nextCtx.fillStyle = '#000000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    }

    drawBoard(board: Board): void {
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                if (board.grid[y][x]) {
                    this.drawBlock(x, y, board.grid[y][x]!);
                }
            }
        }
    }

    drawPiece(piece: Piece): void {
        const blocks = piece.getBlocks();
        for (const block of blocks) {
            if (block.y >= 0) {
                this.drawBlock(block.x, block.y, piece.color);
            }
        }
    }

    drawGhostPiece(piece: Piece): void {
        const blocks = piece.getBlocks();
        for (const block of blocks) {
            if (block.y >= 0) {
                this.drawGhostBlock(block.x, block.y, piece.color);
            }
        }
    }

    private drawBlock(x: number, y: number, color: string): void {
        const pixelX = x * this.blockSize;
        const pixelY = y * this.blockSize;
        
        // Fill the block
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelX, pixelY, this.blockSize, this.blockSize);
        
        // Draw border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(pixelX, pixelY, this.blockSize, this.blockSize);
        
        // Add highlight effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(pixelX, pixelY, this.blockSize, 2);
        this.ctx.fillRect(pixelX, pixelY, 2, this.blockSize);
    }

    private drawGhostBlock(x: number, y: number, color: string): void {
        const pixelX = x * this.blockSize;
        const pixelY = y * this.blockSize;
        
        // Draw transparent version
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(pixelX + 2, pixelY + 2, this.blockSize - 4, this.blockSize - 4);
        this.ctx.setLineDash([]);
    }

    drawNextPiece(piece: Piece): void {
        this.nextCtx.fillStyle = '#000000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        const blockSize = 20;
        const offsetX = (this.nextCanvas.width - piece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - piece.shape.length * blockSize) / 2;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const pixelX = offsetX + x * blockSize;
                    const pixelY = offsetY + y * blockSize;
                    
                    this.nextCtx.fillStyle = piece.color;
                    this.nextCtx.fillRect(pixelX, pixelY, blockSize, blockSize);
                    
                    this.nextCtx.strokeStyle = '#ffffff';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(pixelX, pixelY, blockSize, blockSize);
                }
            }
        }
    }

    drawGrid(): void {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= 10; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= 20; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    }
}
