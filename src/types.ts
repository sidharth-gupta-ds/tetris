export interface Position {
    x: number;
    y: number;
}

export interface TetrominoShape {
    shape: number[][];
    color: string;
}

export enum TetrominoType {
    I = 'I',
    O = 'O',
    T = 'T',
    S = 'S',
    Z = 'Z',
    J = 'J',
    L = 'L'
}

export interface GameState {
    score: number;
    level: number;
    lines: number;
    isPaused: boolean;
    isGameOver: boolean;
}

export interface Controls {
    left: boolean;
    right: boolean;
    down: boolean;
    up: boolean;
    space: boolean;
    pause: boolean;
    restart: boolean;
}
