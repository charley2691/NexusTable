import { Entity } from "@nexustable/shared";
import { EventBus } from "@nexustable/game-engine";

export class SelectionManager {
    private selectedEntity?: Entity;

    constructor(
        private eventBus: EventBus
    ) {}

    select(entity: Entity): void {
        this.selectedEntity = entity;

        this.eventBus.emit("entity.selected", {
            entityId: entity.id,
            entity
        });
    }

    clear(): void {
        const previous = this.selectedEntity;

        this.selectedEntity = undefined;

        this.eventBus.emit("selection.cleared", {
            previousEntityId: previous?.id,
            previousEntity: previous
        });
    }

    getSelected(): Entity | undefined {
        return this.selectedEntity;
    }

    isSelected(entityId: string): boolean {
        return this.selectedEntity?.id === entityId;
    }
}