import { Application } from "pixi.js";
import { Grid } from "../grid/Grid";
import { GridRenderer } from "../grid/GridRenderer";
import { Camera } from "../camera/Camera";
import { CameraController } from "../camera/CameraController";

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

        const gridRenderer = new GridRenderer(grid);

        this.camera.container.addChild(
            gridRenderer.render()
        );
    }
}