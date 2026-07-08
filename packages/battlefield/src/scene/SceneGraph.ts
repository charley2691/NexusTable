import { Entity, Scene } from "@nexustable/shared";

export class SceneGraph {
    constructor(
        private scene: Scene
    ) {}

    getScene(): Scene {
        return this.scene;
    }

    getEntities(): Entity[] {
        return this.scene.entities;
    }

    addEntity(entity: Entity): void {
        this.scene.entities.push(entity);
    }

    removeEntity(entityId: string): void {
        this.scene.entities =
            this.scene.entities.filter(
                entity => entity.id !== entityId
            );
    }
}