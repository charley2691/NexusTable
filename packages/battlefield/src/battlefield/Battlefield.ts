import { Application } from "pixi.js";
import { Grid } from "../grid/Grid";
import { GridRenderer } from "../grid/GridRenderer";

export class Battlefield {
    private app: Application;

    constructor() {
        this.app = new Application();
    }

    async initialize(container: HTMLElement) {
        await this.app.init({
            background: "#1a1a1a",
            resizeTo: container
        });

        container.appendChild(this.app.canvas);

        const grid = new Grid(
            20,
            20,
            50
        );

        const gridRenderer = new GridRenderer(grid);

        this.app.stage.addChild(
            gridRenderer.render()
        );
    }
}