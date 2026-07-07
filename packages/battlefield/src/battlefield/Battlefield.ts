import { Application } from "pixi.js";
import { Entity } from "@nexustable/shared";
import { Grid } from "../grid/Grid";
import { GridRenderer } from "../grid/GridRenderer";
import { GridWorld } from "../grid/GridWorld";
import { Camera } from "../camera/Camera";
import { CameraController } from "../camera/CameraController";
import { EntityRenderer } from "../entities/EntityRenderer";

export class Battlefield {
    private app: Application;
    private camera: Camera;

    constructor() {
        this.app = new Application();
        this.camera = new Camera();
    }

    async initialize(container: HTMLElement) {
        await this.app.init({
            background: "#1a1a1a",
            resizeTo: container
        });

        container.appendChild(this.app.canvas);

        new CameraController(
            this.camera,
            this.app.canvas
        );

        this.app.stage.addChild(
            this.camera.container
        );

        const grid = new Grid(
            20,
            20,
            50
        );

        const gridWorld = new GridWorld(
            grid.cellSize
        );

        const gridRenderer = new GridRenderer(grid);

        this.camera.container.addChild(
            gridRenderer.render()
        );

        const testEntity: Entity = {
            id: "test-token-1",
            components: [
                {
                    type: "grid-position",
                    data: {
                        x: 5,
                        y: 4
                    }
                }
            ]
        };

        const entityRenderer =
            new EntityRenderer(gridWorld);

        this.camera.container.addChild(
            entityRenderer.renderEntity(testEntity)
        );
    }
}