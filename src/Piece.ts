import { Position, TetrominoType } from './types.js';
import { TETROMINO_SHAPES } from './tetrominoes.js';

export class Piece {
    public shape: number[][];
    public color: string;
    public position: Position;
    public type: TetrominoType;

    constructor(type: TetrominoType, x: number = 3, y: number = 0) {
        this.type = type;
        const tetromino = TETROMINO_SHAPES[type];
        this.shape = tetromino.shape.map(row => [...row]);
        this.color = tetromino.color;
        this.position = { x, y };
    }

    rotate(): Piece {
        const rotated = new Piece(this.type, this.position.x, this.position.y);
        const size = this.shape.length;
        rotated.shape = Array(size).fill(null).map(() => Array(size).fill(0));
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                rotated.shape[x][size - 1 - y] = this.shape[y][x];
            }
        }
        
        return rotated;
    }

    move(dx: number, dy: number): Piece {
        const moved = new Piece(this.type, this.position.x + dx, this.position.y + dy);
        moved.shape = this.shape.map(row => [...row]);
        return moved;
    }

    getBlocks(): Position[] {
        const blocks: Position[] = [];
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x]) {
                    blocks.push({
                        x: this.position.x + x,
                        y: this.position.y + y
                    });
                }
            }
        }
        return blocks;
    }

    clone(): Piece {
        const cloned = new Piece(this.type, this.position.x, this.position.y);
        cloned.shape = this.shape.map(row => [...row]);
        return cloned;
    }
}
