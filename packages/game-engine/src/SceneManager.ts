import {
    CameraSettings,
    Campaign,
    Entity,
    GridSettings,
    Scene
} from "@nexustable/shared";

export class SceneManager {
    private scenes: Map<string, Scene> = new Map();

    private currentSceneId?: string;

    private campaign: Campaign | null = null;

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

        this.addScene(scene);

        return scene;
    }

    attachCampaign(
        campaign: Campaign
    ): void {
        this.campaign = campaign;
    }

    detachCampaign(): void {
        this.campaign = null;
    }

    addScene(
        scene: Scene
    ): void {
        if (this.campaign) {
            const existingIndex =
                this.campaign.scenes.findIndex(
                    existing =>
                        existing.id === scene.id
                );

            if (existingIndex === -1) {
                this.campaign.scenes.push(scene);
            } else {
                this.campaign.scenes[existingIndex] =
                    scene;
            }

            if (!this.campaign.activeSceneId) {
                this.setActiveSceneId(scene.id);
            } else {
                this.touchCampaign();
            }

            return;
        }

        this.scenes.set(scene.id, scene);

        if (!this.currentSceneId) {
            this.currentSceneId = scene.id;
        }
    }

    setCurrentScene(
        sceneId: string
    ): void {
        if (!this.getScene(sceneId)) {
            throw new Error(
                `Scene ${sceneId} does not exist`
            );
        }

        this.setActiveSceneId(sceneId);
    }

    getCurrentScene(): Scene | undefined {
        const activeSceneId =
            this.getActiveSceneId();

        if (!activeSceneId) {
            return undefined;
        }

        return this.getScene(activeSceneId);
    }

    getScene(
        id: string
    ): Scene | undefined {
        if (this.campaign) {
            return this.campaign.scenes.find(
                scene =>
                    scene.id === id
            );
        }

        return this.scenes.get(id);
    }

    getAllScenes(): Scene[] {
        if (this.campaign) {
            return [...this.campaign.scenes];
        }

        return Array.from(
            this.scenes.values()
        );
    }

    getEntity(
        sceneId: string,
        entityId: string
    ): Entity | undefined {
        const scene =
            this.getScene(sceneId);

        return scene?.entities.find(
            entity =>
                entity.id === entityId
        );
    }

    addEntity(
        sceneId: string,
        entity: Entity
    ): void {
        const scene =
            this.getScene(sceneId);

        if (!scene) {
            throw new Error(
                `Scene ${sceneId} does not exist`
            );
        }

        scene.entities.push(entity);

        this.touchCampaign();
    }

    updateEntity(
        sceneId: string,
        entity: Entity
    ): void {
        const scene =
            this.getScene(sceneId);

        if (!scene) {
            return;
        }

        const index =
            scene.entities.findIndex(
                existing =>
                    existing.id === entity.id
            );

        if (index === -1) {
            return;
        }

        scene.entities[index] = entity;

        this.touchCampaign();
    }

    removeEntity(
        sceneId: string,
        entityId: string
    ): void {
        const scene =
            this.getScene(sceneId);

        if (!scene) {
            return;
        }

        const originalLength =
            scene.entities.length;

        scene.entities =
            scene.entities.filter(
                entity =>
                    entity.id !== entityId
            );

        if (
            scene.entities.length !==
            originalLength
        ) {
            this.touchCampaign();
        }
    }

    private getActiveSceneId(): string | undefined {
        if (this.campaign) {
            return this.campaign.activeSceneId;
        }

        return this.currentSceneId;
    }

    private setActiveSceneId(
        sceneId: string
    ): void {
        if (this.campaign) {
            this.campaign.activeSceneId =
                sceneId;

            this.touchCampaign();

            return;
        }

        this.currentSceneId = sceneId;
    }

    private touchCampaign(): void {
        if (!this.campaign) {
            return;
        }

        this.campaign.metadata.updatedAt =
            new Date().toISOString();
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