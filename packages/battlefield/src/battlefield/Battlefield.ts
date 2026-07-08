import { Application } from "pixi.js";
import { Entity, Scene } from "@nexustable/shared";
import { EventBus } from "@nexustable/game-engine";
import { Camera } from "../camera/Camera";
import { CameraController } from "../camera/CameraController";
import { AssetManager } from "../assets/AssetManager";
import { SceneRenderer } from "../renderer/SceneRenderer";
import { SelectionManager } from "../selection/SelectionManager";
import { InputManager } from "../input/InputManager";
import { PixiInputAdapter } from "../input/PixiInputAdapter";

export class Battlefield {
    private app: Application;
    private camera: Camera;
    private assetManager: AssetManager;
    private eventBus: EventBus;
    private selectionManager: SelectionManager;
    private inputManager: InputManager;
    private inputAdapter?: PixiInputAdapter;
    private sceneRenderer: SceneRenderer;

    constructor() {
        this.app = new Application();
        this.camera = new Camera();
        this.assetManager = new AssetManager();
        this.eventBus = new EventBus();

        this.selectionManager =
            new SelectionManager(this.eventBus);

        this.inputManager =
            new InputManager(this.eventBus);

        this.sceneRenderer =
            new SceneRenderer(
                this.assetManager,
                this.selectionManager
            );
    }

    async initialize(container: HTMLElement) {
        await this.app.init({
            background: "#1a1a1a",
            resizeTo: container
        });

        container.appendChild(this.app.canvas);

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

        this.camera.container.addChild(
            this.sceneRenderer.getContainer()
        );

        this.eventBus.on("entity.selected", (event) => {
            console.log("Entity selected:", event);
        });

        this.eventBus.on("selection.cleared", (event) => {
            console.log("Selection cleared:", event);
        });

        this.eventBus.on("input.pointer.down", (event) => {
            console.log("Pointer Down", event);
        });

        this.eventBus.on("input.pointer.up", (event) => {
            console.log("Pointer Up", event);
        });

        await this.sceneRenderer.render(
            this.createDemoScene()
        );
    }

    private registerDemoAssets() {
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

    private createDemoScene(): Scene {
        const player: Entity = {
            id: "player-token-1",
            components: [
                {
                    type: "grid-position",
                    data: {
                        x: 5,
                        y: 4
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
            id: "monster-token-1",
            components: [
                {
                    type: "grid-position",
                    data: {
                        x: 10,
                        y: 6
                    }
                }
            ]
        };

        return {
            version: 1,

            id: "demo-scene",

            name: "Demo Battlefield",

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