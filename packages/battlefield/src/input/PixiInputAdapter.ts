import { Container, FederatedPointerEvent } from "pixi.js";
import { InputManager } from "./InputManager";

export class PixiInputAdapter {
    constructor(
        private target: Container,
        private input: InputManager
    ) {}

    initialize(): void {
        this.target.eventMode = "static";

        this.target.on(
            "pointerdown",
            this.onPointerDown,
            this
        );

        this.target.on(
            "pointermove",
            this.onPointerMove,
            this
        );

        this.target.on(
            "pointerup",
            this.onPointerUp,
            this
        );

        this.target.on(
            "pointerupoutside",
            this.onPointerUp,
            this
        );
    }

    private onPointerDown(
        event: FederatedPointerEvent
    ): void {
        this.input.pointerDown(
            event.global.x,
            event.global.y,
            event.button
        );
    }

    private onPointerMove(
        event: FederatedPointerEvent
    ): void {
        this.input.pointerMove(
            event.global.x,
            event.global.y
        );
    }

    private onPointerUp(
        event: FederatedPointerEvent
    ): void {
        this.input.pointerUp(
            event.global.x,
            event.global.y
        );
    }
}