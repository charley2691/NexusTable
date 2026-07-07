import { GridPosition, Position } from "@nexustable/shared";

export class GridWorld {

    constructor(
        public cellSize: number
    ) {}

    gridToWorld(
        position: GridPosition
    ): Position {

        return {
            x: position.x * this.cellSize,
            y: position.y * this.cellSize
        };
    }

    worldToGrid(
        position: Position
    ): GridPosition {

        return {
            x: Math.floor(position.x / this.cellSize),
            y: Math.floor(position.y / this.cellSize)
        };
    }
}