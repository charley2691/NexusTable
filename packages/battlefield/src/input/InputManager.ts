import { EventBus } from "@nexustable/game-engine";
import { PointerState } from "./InputTypes";

export class InputManager {
    private pointerState: PointerState = {
        position: {
            x: 0,
            y: 0
        },
        previousPosition: {
            x: 0,
            y: 0
        },
        isDown: false,
        button: null
    };

    constructor(
        private eventBus: EventBus
    ) {}

    pointerDown(
        x: number,
        y: number,
        button: number
    ): void {
        this.updatePosition(x, y);

        this.pointerState.isDown = true;
        this.pointerState.button = button;

        this.eventBus.emit("input.pointer.down", {
            ...this.pointerState
        });
    }

    pointerMove(
        x: number,
        y: number
    ): void {
        this.updatePosition(x, y);

        this.eventBus.emit("input.pointer.move", {
            ...this.pointerState
        });
    }

    pointerUp(
        x: number,
        y: number
    ): void {
        this.updatePosition(x, y);

        this.pointerState.isDown = false;
        this.pointerState.button = null;

        this.eventBus.emit("input.pointer.up", {
            ...this.pointerState
        });
    }

    getPointerState(): PointerState {
        return this.pointerState;
    }

    private updatePosition(
        x: number,
        y: number
    ): void {
        this.pointerState.previousPosition = {
            ...this.pointerState.position
        };

        this.pointerState.position = {
            x,
            y
        };
    }
}