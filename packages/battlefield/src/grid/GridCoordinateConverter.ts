import { Container, Point } from "pixi.js";
import { GridPosition, Position } from "@nexustable/shared";

export class GridCoordinateConverter {
    constructor(
        private worldContainer: Container,
        private cellSize: number
    ) {}

    screenToWorld(
        screen: Position
    ): Position {
        const local =
            this.worldContainer.toLocal(
                new Point(
                    screen.x,
                    screen.y
                )
            );

        return {
            x: local.x,
            y: local.y
        };
    }

    worldToGrid(
        world: Position
    ): GridPosition {
        return {
            x: Math.floor(world.x / this.cellSize),
            y: Math.floor(world.y / this.cellSize)
        };
    }

    gridToWorld(
        grid: GridPosition
    ): Position {
        return {
            x: grid.x * this.cellSize,
            y: grid.y * this.cellSize
        };
    }

    screenToGrid(
        screen: Position
    ): GridPosition {
        return this.worldToGrid(
            this.screenToWorld(screen)
        );
    }
}