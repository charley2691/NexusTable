import { EventBus } from "@nexustable/game-engine";
import { SelectionManager } from "../selection/SelectionManager";

interface PointerEventData {
    position: {
        x: number;
        y: number;
    };
    button: number | null;
    isDown: boolean;
    isBackground: boolean;
}

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

    private onPointerDown(event: unknown): void {
        const data = event as PointerEventData;

        if (data.button !== 0) return;

        if (data.isBackground) {
            this.selection.clear();
            return;
        }

        const selected = this.selection.getSelected();

        if (!selected) return;

        this.dragging = true;

        this.eventBus.emit("drag.started", {
            entityId: selected.id,
            x: data.position.x,
            y: data.position.y
        });
    }

    private onPointerMove(event: unknown): void {
        if (!this.dragging) return;

        const selected = this.selection.getSelected();

        if (!selected) return;

        const data = event as PointerEventData;

        this.eventBus.emit("drag.preview", {
            entityId: selected.id,
            x: data.position.x,
            y: data.position.y
        });
    }

    private onPointerUp(event: unknown): void {
        if (!this.dragging) return;

        const selected = this.selection.getSelected();

        if (!selected) return;

        const data = event as PointerEventData;

        this.eventBus.emit("drag.finished", {
            entityId: selected.id,
            x: data.position.x,
            y: data.position.y
        });

        this.dragging = false;
    }

    isDragging(): boolean {
        return this.dragging;
    }
}