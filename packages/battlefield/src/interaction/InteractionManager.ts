import { EventBus } from "@nexustable/game-engine";
import { SelectionManager } from "../selection/SelectionManager";

export class InteractionManager {
    private dragging = false;

    constructor(
        private eventBus: EventBus,
        private selection: SelectionManager
    ) {}

    initialize(): void {
        this.eventBus.on(
            "input.pointer.down",
            this.onPointerDown.bind(this)
        );

        this.eventBus.on(
            "input.pointer.move",
            this.onPointerMove.bind(this)
        );

        this.eventBus.on(
            "input.pointer.up",
            this.onPointerUp.bind(this)
        );
    }

    private onPointerDown(): void {
        if (!this.selection.getSelected()) {
            return;
        }

        this.dragging = true;

        console.log(
            "Drag Started"
        );
    }

    private onPointerMove(): void {
        if (!this.dragging) {
            return;
        }

        console.log(
            "Dragging..."
        );
    }

    private onPointerUp(): void {
        if (!this.dragging) {
            return;
        }

        this.dragging = false;

        console.log(
            "Drag Finished"
        );
    }

    isDragging(): boolean {
        return this.dragging;
    }
}