import { Controls } from './types.js';

interface KeyState {
    pressed: boolean;
    lastActionTime: number;
    initialPress: boolean;
    hasTriggered: boolean;
}

export class InputHandler {
    private controls: Controls;
    
    // Timing configuration for better control feel
    private moveRepeatDelay: number = 250;  // Initial delay before repeat (ms)
    private moveRepeatRate: number = 120;   // Rate of repeat movement (ms)
    private downRepeatRate: number = 50;    // Faster repeat for down arrow
    
    private keyStates: Map<string, KeyState>;
    private singleTapKeys: Set<string>;

    constructor() {
        this.controls = {
            left: false,
            right: false,
            down: false,
            up: false,
            space: false,
            pause: false,
            restart: false
        };
        
        this.keyStates = new Map();
        
        // Keys that should trigger single actions first, then repeat
        this.singleTapKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown']);
        
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.code;
        const now = Date.now();
        
        // Initialize key state if it doesn't exist
        if (!this.keyStates.has(key)) {
            this.keyStates.set(key, {
                pressed: false,
                lastActionTime: 0,
                initialPress: false,
                hasTriggered: false
            });
        }
        
        const keyState = this.keyStates.get(key)!;
        
        // Handle initial key press
        if (!keyState.pressed) {
            keyState.pressed = true;
            keyState.initialPress = true;
            keyState.lastActionTime = now;
            keyState.hasTriggered = false;
            
            // Trigger immediate action for single-tap keys
            if (this.singleTapKeys.has(key)) {
                this.triggerAction(key);
                keyState.hasTriggered = true;
            } else {
                // For non-movement keys, use the old behavior
                this.updateControls(key, true);
            }
        }
        
        event.preventDefault();
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.code;
        
        if (this.keyStates.has(key)) {
            const keyState = this.keyStates.get(key)!;
            keyState.pressed = false;
            keyState.initialPress = false;
            keyState.hasTriggered = false;
        }
        
        // Only update controls for non-movement keys on key up
        if (!this.singleTapKeys.has(key)) {
            this.updateControls(key, false);
        }
        
        event.preventDefault();
    }

    // Update method to be called from the game loop
    public update(): void {
        const now = Date.now();
        
        for (const [key, keyState] of this.keyStates) {
            if (keyState.pressed && this.singleTapKeys.has(key)) {
                const repeatRate = key === 'ArrowDown' ? this.downRepeatRate : this.moveRepeatRate;
                
                // Check if enough time has passed for repeat action
                if (keyState.hasTriggered && 
                    now - keyState.lastActionTime > (keyState.initialPress ? this.moveRepeatDelay : repeatRate)) {
                    
                    keyState.initialPress = false;
                    keyState.lastActionTime = now;
                    this.triggerAction(key);
                }
            }
        }
    }

    private triggerAction(key: string): void {
        // Reset all movement controls first
        this.controls.left = false;
        this.controls.right = false;
        this.controls.down = false;
        
        // Set the specific control based on key
        switch (key) {
            case 'ArrowLeft':
                this.controls.left = true;
                break;
            case 'ArrowRight':
                this.controls.right = true;
                break;
            case 'ArrowDown':
                this.controls.down = true;
                break;
        }
    }

    private updateControls(key: string, pressed: boolean): void {
        switch (key) {
            case 'ArrowUp':
                this.controls.up = pressed;
                break;
            case 'Space':
                this.controls.space = pressed;
                break;
            case 'KeyP':
                if (pressed) this.controls.pause = !this.controls.pause;
                break;
            case 'KeyR':
                this.controls.restart = pressed;
                break;
        }
    }

    getControls(): Controls {
        return { ...this.controls };
    }

    resetOneTimeControls(): void {
        this.controls.up = false;
        this.controls.space = false;
        this.controls.restart = false;
        this.controls.left = false;
        this.controls.right = false;
        this.controls.down = false;
    }

    // Method to adjust timing settings
    public setMovementTiming(repeatDelay: number, repeatRate: number): void {
        this.moveRepeatDelay = repeatDelay;
        this.moveRepeatRate = repeatRate;
    }
}
