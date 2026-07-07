import { Graphics } from "pixi.js";
import { Grid } from "./Grid";

export class GridRenderer {
    private graphics: Graphics;

    constructor(
        private grid: Grid
    ) {
        this.graphics = new Graphics();
    }

    render() {
        const size = this.grid.cellSize;

        for (let x = 0; x <= this.grid.width; x++) {
            this.graphics
                .moveTo(x * size, 0)
                .lineTo(
                    x * size,
                    this.grid.height * size
                );
        }

        for (let y = 0; y <= this.grid.height; y++) {
            this.graphics
                .moveTo(0, y * size)
                .lineTo(
                    this.grid.width * size,
                    y * size
                );
        }

        this.graphics.stroke({
            width: 1,
            color: 0x555555
        });

        return this.graphics;
    }
}