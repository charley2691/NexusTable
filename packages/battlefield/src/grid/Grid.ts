export class Grid {
    readonly cellSize: number;
    readonly width: number;
    readonly height: number;

    constructor(
        width: number,
        height: number,
        cellSize = 50
    ) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
    }

    gridToWorld(x: number, y: number) {
        return {
            x: x * this.cellSize,
            y: y * this.cellSize
        };
    }

    worldToGrid(x: number, y: number) {
        return {
            x: Math.floor(x / this.cellSize),
            y: Math.floor(y / this.cellSize)
        };
    }
}