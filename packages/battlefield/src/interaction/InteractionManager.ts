import { Container, FederatedPointerEvent } from "pixi.js";

export class InteractionManager {

    constructor(
        private stage: Container
    ) {}

    initialize(): void {

        this.stage.eventMode = "static";

        this.stage.on(
            "pointerdown",
            this.onPointerDown,
            this
        );

        this.stage.on(
            "pointermove",
            this.onPointerMove,
            this
        );

        this.stage.on(
            "pointerup",
            this.onPointerUp,
            this
        );

        this.stage.on(
            "pointerupoutside",
            this.onPointerUp,
            this
        );

    }

    private onPointerDown(
        event: FederatedPointerEvent
    ) {
        console.log(
            "Pointer Down",
            event.global
        );
    }

    private onPointerMove(
        event: FederatedPointerEvent
    ) {
        // Dragging comes next
    }

    private onPointerUp(
        event: FederatedPointerEvent
    ) {
        console.log(
            "Pointer Up",
            event.global
        );
    }

}