import { Container, Graphics } from "pixi.js";
import { Entity } from "@nexustable/shared";
import { GridWorld } from "../grid/GridWorld";

export class EntityRenderer {
    private container = new Container();

    constructor(
        private gridWorld: GridWorld
    ) {}

    renderEntity(entity: Entity) {
        const position = entity.components.find(
            component => component.type === "grid-position"
        );

        if (!position) return this.container;

        const data = position.data as {
            x: number;
            y: number;
        };

        const worldPosition =
            this.gridWorld.gridToWorld({
                x: data.x,
                y: data.y
            });

        const token = new Graphics();

        token.circle(
            worldPosition.x + 25,
            worldPosition.y + 25,
            20
        );

        token.fill(0x3b82f6);

        this.container.addChild(token);

        return this.container;
    }
}