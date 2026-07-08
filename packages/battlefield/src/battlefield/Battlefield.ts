import { Application } from "pixi.js";
import { Entity, Scene } from "@nexustable/shared";
import { Grid } from "../grid/Grid";
import { GridRenderer } from "../grid/GridRenderer";
import { GridWorld } from "../grid/GridWorld";
import { Camera } from "../camera/Camera";
import { CameraController } from "../camera/CameraController";
import { EntityRenderer } from "../entities/EntityRenderer";
import { SceneGraph } from "../scene/SceneGraph";
import { AssetManager } from "../assets/AssetManager";

export class Battlefield {
    private app: Application;
    private camera: Camera;
    private assetManager: AssetManager;

    constructor() {
        this.app = new Application();
        this.camera = new Camera();
        this.assetManager = new AssetManager();
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

        const scene = this.createDemoScene();
        const sceneGraph = new SceneGraph(scene);

        await this.renderScene(sceneGraph);
    }

    private registerDemoAssets() {
        this.assetManager.register({
            id: "test-token",
            type: "token",
            name: "Test Token",
            path: "/assets/tokens/test-token.png"
        });
    }

    private async renderScene(sceneGraph: SceneGraph) {
        const grid = new Grid(
            20,
            20,
            50
        );

        const gridWorld =
            new GridWorld(grid.cellSize);

        const gridRenderer =
            new GridRenderer(grid);

        this.camera.container.addChild(
            gridRenderer.render()
        );

        const entityRenderer =
            new EntityRenderer(
                gridWorld,
                this.assetManager
            );

        for (const entity of sceneGraph.getEntities()) {
            this.camera.container.addChild(
                await entityRenderer.renderEntity(entity)
            );
        }
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