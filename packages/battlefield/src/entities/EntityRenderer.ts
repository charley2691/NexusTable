import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { Entity } from "@nexustable/shared";
import { GridWorld } from "../grid/GridWorld";
import { AssetManager } from "../assets/AssetManager";

export class EntityRenderer {
    constructor(
        private gridWorld: GridWorld,
        private assetManager: AssetManager
    ) {}

    async renderEntity(entity: Entity): Promise<Container> {
        const container = new Container();

        const position = entity.components.find(
            component => component.type === "grid-position"
        );

        if (!position) return container;

        const data = position.data as {
            x: number;
            y: number;
        };

        const worldPosition =
            this.gridWorld.gridToWorld({
                x: data.x,
                y: data.y
            });

        const spriteComponent = entity.components.find(
            component => component.type === "sprite"
        );

        if (spriteComponent) {
            const spriteData = spriteComponent.data as {
                assetId: string;
            };

            const asset =
                this.assetManager.get(spriteData.assetId);

            if (asset) {
                try {
                    const texture =
                        await Assets.load(asset.path);

                    const sprite =
                        new Sprite(texture);

                    sprite.width = this.gridWorld.cellSize;
                    sprite.height = this.gridWorld.cellSize;

                    sprite.x = worldPosition.x;
                    sprite.y = worldPosition.y;

                    container.addChild(sprite);

                    return container;
                } catch (error) {
                    console.warn(
                        "Failed to load token asset:",
                        asset.path,
                        error
                    );
                }
            }
        }

        const token = new Graphics();

        token.circle(
            worldPosition.x + this.gridWorld.cellSize / 2,
            worldPosition.y + this.gridWorld.cellSize / 2,
            this.gridWorld.cellSize * 0.4
        );

        token.fill(0x3b82f6);

        container.addChild(token);

        return container;
    }
}