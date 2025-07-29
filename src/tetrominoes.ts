import { TetrominoShape, TetrominoType } from './types.js';

export const TETROMINO_SHAPES: Record<TetrominoType, TetrominoShape> = {
    [TetrominoType.I]: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: '#00f5ff'
    },
    [TetrominoType.O]: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '#ffff00'
    },
    [TetrominoType.T]: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#a000f0'
    },
    [TetrominoType.S]: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: '#00f000'
    },
    [TetrominoType.Z]: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: '#f00000'
    },
    [TetrominoType.J]: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#0000f0'
    },
    [TetrominoType.L]: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#ff8000'
    }
};

export const TETROMINO_TYPES = Object.values(TetrominoType);
