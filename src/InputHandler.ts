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
    
    // Touch control properties
    private touchStates: Map<string, KeyState>;
    private touchRepeatIntervals: Map<string, number>;
    private touchTimeouts: Map<string, number>;

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
        this.touchStates = new Map();
        this.touchRepeatIntervals = new Map();
        this.touchTimeouts = new Map();
        
        // Keys that should trigger single actions first, then repeat
        this.singleTapKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown']);
        
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Setup touch controls
        this.setupTouchControls();
    }
    
    private setupTouchControls(): void {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeTouchControls());
        } else {
            this.initializeTouchControls();
        }
    }
    
    private initializeTouchControls(): void {
        const touchButtons = document.querySelectorAll('.control-btn');
        
        touchButtons.forEach(button => {
            const action = button.getAttribute('data-action');
            if (!action) return;
            
            // Prevent default touch behaviors
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTouchStart(action);
            }, { passive: false });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleTouchEnd(action);
            }, { passive: false });
            
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.handleTouchEnd(action);
            }, { passive: false });
            
            // Also handle mouse events for testing on desktop
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleTouchStart(action);
            });
            
            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.handleTouchEnd(action);
            });
            
            button.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.handleTouchEnd(action);
            });
        });
    }
    
    private handleTouchStart(action: string): void {
        const now = Date.now();
        
        // Initialize touch state if it doesn't exist
        if (!this.touchStates.has(action)) {
            this.touchStates.set(action, {
                pressed: false,
                lastActionTime: 0,
                initialPress: false,
                hasTriggered: false
            });
        }
        
        const touchState = this.touchStates.get(action)!;
        
        if (!touchState.pressed) {
            touchState.pressed = true;
            touchState.initialPress = true;
            touchState.lastActionTime = now;
            touchState.hasTriggered = false;
            
            // Trigger immediate action
            this.triggerTouchAction(action);
            touchState.hasTriggered = true;
            
            // Set up repeat for movement actions
            if (['left', 'right', 'down'].includes(action)) {
                const repeatRate = action === 'down' ? this.downRepeatRate : this.moveRepeatRate;
                
                // Clear any existing interval and timeout
                if (this.touchRepeatIntervals.has(action)) {
                    clearInterval(this.touchRepeatIntervals.get(action)!);
                }
                if (this.touchTimeouts.has(action)) {
                    clearTimeout(this.touchTimeouts.get(action)!);
                }
                
                // Set up repeat after initial delay
                const timeoutId = window.setTimeout(() => {
                    const repeatIntervalId = window.setInterval(() => {
                        if (touchState.pressed) {
                            this.triggerTouchAction(action);
                        } else {
                            clearInterval(repeatIntervalId);
                            this.touchRepeatIntervals.delete(action);
                        }
                    }, repeatRate);
                    this.touchRepeatIntervals.set(action, repeatIntervalId);
                    this.touchTimeouts.delete(action);
                }, this.moveRepeatDelay);
                this.touchTimeouts.set(action, timeoutId);
            }
        }
    }
    
    private handleTouchEnd(action: string): void {
        if (this.touchStates.has(action)) {
            const touchState = this.touchStates.get(action)!;
            touchState.pressed = false;
            touchState.initialPress = false;
            touchState.hasTriggered = false;
        }
        
        // Clear any repeat intervals and timeouts
        if (this.touchRepeatIntervals.has(action)) {
            clearInterval(this.touchRepeatIntervals.get(action)!);
            this.touchRepeatIntervals.delete(action);
        }
        if (this.touchTimeouts.has(action)) {
            clearTimeout(this.touchTimeouts.get(action)!);
            this.touchTimeouts.delete(action);
        }
        
        // Reset movement controls when touch ends
        if (['left', 'right', 'down'].includes(action)) {
            this.controls.left = false;
            this.controls.right = false;
            this.controls.down = false;
        }
    }
    
    private triggerTouchAction(action: string): void {
        // Reset all movement controls first for movement actions
        if (['left', 'right', 'down'].includes(action)) {
            this.controls.left = false;
            this.controls.right = false;
            this.controls.down = false;
        }
        
        switch (action) {
            case 'left':
                this.controls.left = true;
                break;
            case 'right':
                this.controls.right = true;
                break;
            case 'down':
                this.controls.down = true;
                break;
            case 'rotate':
                this.controls.up = true;
                break;
            case 'hard-drop':
                this.controls.space = true;
                break;
            case 'pause':
                this.controls.pause = !this.controls.pause;
                break;
            case 'restart':
                this.controls.restart = true;
                break;
        }
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
