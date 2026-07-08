import { Entity } from "@nexustable/shared";
import { AssetManager } from "../../assets/AssetManager";
import { EntityRenderer } from "../../entities/EntityRenderer";
import { GridWorld } from "../../grid/GridWorld";
import { Layer } from "./Layer";

export class TokenLayer extends Layer {

    constructor(
        private gridWorld: GridWorld,
        private assets: AssetManager
    ) {
        super();
    }

    async render(
        entities: Entity[]
    ): Promise<void> {

        this.clear();

        const renderer =
            new EntityRenderer(
                this.gridWorld,
                this.assets
            );

        for (const entity of entities) {

            this.container.addChild(
                await renderer.renderEntity(entity)
            );

        }

    }

}