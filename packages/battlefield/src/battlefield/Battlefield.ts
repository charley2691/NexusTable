import { Application } from "pixi.js";
import {
    Component,
    Entity,
    Scene
} from "@nexustable/shared";
import {
    CampaignManager,
    EventBus,
    SceneManager
} from "@nexustable/game-engine";
import { Camera } from "../camera/Camera";
import { CameraController } from "../camera/CameraController";
import { AssetManager } from "../assets/AssetManager";
import { SceneRenderer } from "../renderer/SceneRenderer";
import { SelectionManager } from "../selection/SelectionManager";
import { InputManager } from "../input/InputManager";
import { PixiInputAdapter } from "../input/PixiInputAdapter";
import { InteractionManager } from "../interaction/InteractionManager";
import { GridCoordinateConverter } from "../grid/GridCoordinateConverter";

export class Battlefield {
    private app: Application;
    private camera: Camera;
    private assetManager: AssetManager;
    private eventBus: EventBus;
    private selectionManager: SelectionManager;
    private inputManager: InputManager;
    private inputAdapter?: PixiInputAdapter;
    private interactionManager: InteractionManager;
    private sceneRenderer: SceneRenderer;
    private campaignManager: CampaignManager;
    private sceneManager: SceneManager;
    private coordinateConverter?: GridCoordinateConverter;

    constructor() {
        this.app = new Application();

        this.camera = new Camera();

        this.assetManager =
            new AssetManager();

        this.eventBus =
            new EventBus();

        this.campaignManager =
            new CampaignManager();

        this.selectionManager =
            new SelectionManager(
                this.eventBus
            );

        this.inputManager =
            new InputManager(
                this.eventBus
            );

        this.interactionManager =
            new InteractionManager(
                this.eventBus,
                this.selectionManager
            );

        this.sceneRenderer =
            new SceneRenderer(
                this.assetManager,
                this.selectionManager,
                this.eventBus
            );

        this.sceneManager =
            new SceneManager();
    }

    async initialize(
        container: HTMLElement
    ): Promise<void> {
        await this.app.init({
            background: "#1a1a1a",
            resizeTo: container
        });

        container.appendChild(
            this.app.canvas
        );

        this.registerDemoAssets();

        new CameraController(
            this.camera,
            this.app.canvas
        );

        this.app.stage.addChild(
            this.camera.container
        );

        this.inputAdapter =
            new PixiInputAdapter(
                this.app.stage,
                this.inputManager
            );

        this.inputAdapter.initialize();

        this.interactionManager.initialize();

        this.camera.container.addChild(
            this.sceneRenderer.getContainer()
        );

        const campaign =
            this.campaignManager.createCampaign(
                "NexusTable Demo Campaign"
            );

        this.sceneManager.attachCampaign(
            campaign
        );

        const demoScene =
            this.createDemoScene(
                "demo-scene",
                "Demo Battlefield",
                5,
                4,
                10,
                6
            );

        const forestScene =
            this.createDemoScene(
                "forgotten-forest",
                "Forgotten Forest",
                3,
                8,
                14,
                5
            );

        const villageScene =
            this.createDemoScene(
                "village-square",
                "Village Square",
                8,
                12,
                12,
                10
            );

        this.sceneManager.addScene(
            demoScene
        );

        this.sceneManager.addScene(
            forestScene
        );

        this.sceneManager.addScene(
            villageScene
        );

        this.eventBus.on(
            "drag.finished",
            async (event) => {
                await this.handleDragFinished(
                    event
                );
            }
        );

        await this.loadScene(
            demoScene.id
        );
    }

    public getCampaignManager(): CampaignManager {
        return this.campaignManager;
    }

    public getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    public getSelectionManager(): SelectionManager {
        return this.selectionManager;
    }

    public getEventBus(): EventBus {
        return this.eventBus;
    }

    public getAssetManager(): AssetManager {
        return this.assetManager;
    }

    public async loadScene(
        sceneId: string
    ): Promise<boolean> {
        this.sceneManager.setCurrentScene(
            sceneId
        );

        const scene =
            this.sceneManager.getCurrentScene();

        if (
            !scene ||
            scene.id !== sceneId
        ) {
            return false;
        }

        this.coordinateConverter =
            new GridCoordinateConverter(
                this.sceneRenderer.getContainer(),
                scene.grid.cellSize
            );

        await this.sceneRenderer.render(
            scene
        );

        return true;
    }

    private async handleDragFinished(
        event: unknown
    ): Promise<void> {
        const data = event as {
            entityId: string;
            x: number;
            y: number;
        };

        const scene =
            this.sceneManager.getCurrentScene();

        if (
            !scene ||
            !this.coordinateConverter
        ) {
            return;
        }

        const entity =
            this.sceneManager.getEntity(
                scene.id,
                data.entityId
            );

        if (!entity) {
            return;
        }

        const gridPosition =
            this.coordinateConverter.screenToGrid({
                x: data.x,
                y: data.y
            });

        const updatedEntity: Entity = {
            ...entity,

            components:
                entity.components.map(
                    (
                        component: Component
                    ) => {
                        if (
                            component.type !==
                            "grid-position"
                        ) {
                            return component;
                        }

                        return {
                            ...component,

                            data: {
                                x: gridPosition.x,
                                y: gridPosition.y
                            }
                        };
                    }
                )
        };

        this.sceneManager.updateEntity(
            scene.id,
            updatedEntity
        );

        const updatedScene =
            this.sceneManager.getCurrentScene();

        if (!updatedScene) {
            return;
        }

        await this.sceneRenderer.render(
            updatedScene
        );
    }

    private registerDemoAssets(): void {
        this.assetManager.register({
            id: "test-token",
            type: "token",
            name: "Test Token",
            path: "/assets/tokens/test-token.png"
        });

        this.assetManager.register({
            id: "demo-map",
            type: "map",
            name: "Demo Map",
            path: "/assets/maps/demo-map.jpg"
        });
    }

    private createDemoScene(
        id: string,
        name: string,
        playerX: number,
        playerY: number,
        monsterX: number,
        monsterY: number
    ): Scene {
        const player: Entity = {
            id: `${id}-player-token`,

            components: [
                {
                    type: "grid-position",

                    data: {
                        x: playerX,
                        y: playerY
                    }
                },
                {
                    type: "sprite",

                    data: {
                        assetId: "test-token"
                    }
                }
            ]
        };

        const monster: Entity = {
            id: `${id}-monster-token`,

            components: [
                {
                    type: "grid-position",

                    data: {
                        x: monsterX,
                        y: monsterY
                    }
                }
            ]
        };

        return {
            version: 1,
            id,
            name,

            grid: {
                width: 20,
                height: 20,
                cellSize: 50,
                color: 0x555555,
                opacity: 1,
                visible: true
            },

            camera: {
                zoom: 1,

                position: {
                    x: 0,
                    y: 0
                }
            },

            map: {
                assetId: "demo-map",
                x: 0,
                y: 0,
                width: 1000,
                height: 1000,
                rotation: 0,
                visible: true,
                opacity: 1
            },

            entities: [
                player,
                monster
            ],

            metadata: {}
        };
    }
}