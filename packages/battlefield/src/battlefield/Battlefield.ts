import { Application } from "pixi.js";
import { Entity, Scene } from "@nexustable/shared";
import { Camera } from "../camera/Camera";
import { CameraController } from "../camera/CameraController";
import { AssetManager } from "../assets/AssetManager";
import { SceneRenderer } from "../renderer/SceneRenderer";

export class Battlefield {
    private app: Application;
    private camera: Camera;
    private assetManager: AssetManager;
    private sceneRenderer: SceneRenderer;

    constructor() {
        this.app = new Application();
        this.camera = new Camera();
        this.assetManager = new AssetManager();
        this.sceneRenderer = new SceneRenderer(
            this.assetManager
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

        this.camera.container.addChild(
            this.sceneRenderer.getContainer()
        );

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
            id: "demo-scene",
            name: "Demo Battlefield",
            metadata: {
                grid: {
                    width: 20,
                    height: 20,
                    cellSize: 50
                }
            },
            entities: [
                player,
                monster
            ]
        };
    }
}