import {
    CameraSettings,
    Entity,
    GridSettings,
    Scene
} from "@nexustable/shared";

export class SceneManager {
    private scenes: Map<string, Scene> = new Map();
    private currentSceneId?: string;

    createScene(
        name: string
    ): Scene {
        const scene: Scene = {
            version: 1,

            id: crypto.randomUUID(),
            name,

            grid: this.createDefaultGridSettings(),

            camera: this.createDefaultCameraSettings(),

            entities: [],

            metadata: {}
        };

        this.scenes.set(scene.id, scene);
        this.currentSceneId = scene.id;

        return scene;
    }

    setCurrentScene(
        sceneId: string
    ): void {
        if (!this.scenes.has(sceneId)) {
            throw new Error(
                `Scene ${sceneId} does not exist`
            );
        }

        this.currentSceneId = sceneId;
    }

    getCurrentScene(): Scene | undefined {
        if (!this.currentSceneId) {
            return undefined;
        }

        return this.scenes.get(this.currentSceneId);
    }

    getScene(
        id: string
    ): Scene | undefined {
        return this.scenes.get(id);
    }

    getAllScenes(): Scene[] {
        return Array.from(
            this.scenes.values()
        );
    }

    addEntity(
        sceneId: string,
        entity: Entity
    ): void {
        const scene = this.scenes.get(sceneId);

        if (!scene) {
            throw new Error(
                `Scene ${sceneId} does not exist`
            );
        }

        scene.entities.push(entity);
    }

    updateEntity(
        sceneId: string,
        entity: Entity
    ): void {
        const scene = this.scenes.get(sceneId);

        if (!scene) return;

        const index =
            scene.entities.findIndex(
                existing =>
                    existing.id === entity.id
            );

        if (index === -1) return;

        scene.entities[index] = entity;
    }

    removeEntity(
        sceneId: string,
        entityId: string
    ): void {
        const scene = this.scenes.get(sceneId);

        if (!scene) return;

        scene.entities =
            scene.entities.filter(
                entity =>
                    entity.id !== entityId
            );
    }

    private createDefaultGridSettings(): GridSettings {
        return {
            width: 20,
            height: 20,
            cellSize: 50,
            color: 0x555555,
            opacity: 1,
            visible: true
        };
    }

    private createDefaultCameraSettings(): CameraSettings {
        return {
            zoom: 1,
            position: {
                x: 0,
                y: 0
            }
        };
    }
}