import {
    Container,
    FederatedPointerEvent,
    Rectangle
} from "pixi.js";
import { InputManager } from "./InputManager";

export class PixiInputAdapter {
    constructor(
        private target: Container,
        private input: InputManager
    ) {}

    initialize(): void {
        this.target.eventMode = "static";

        this.target.hitArea = new Rectangle(
            -100000,
            -100000,
            200000,
            200000
        );

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
        const isBackground =
            !this.isTokenTarget(event.target);

        this.input.pointerDown(
            event.global.x,
            event.global.y,
            event.button,
            isBackground
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

    private isTokenTarget(target: unknown): boolean {
        let current = target as Container | null;

        while (current) {
            if (current.name === "entity-token") {
                return true;
            }

            current = current.parent;
        }

        return false;
    }
}