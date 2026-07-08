import { Container, Graphics } from "pixi.js";
import { Entity } from "@nexustable/shared";
import { AssetManager } from "../../assets/AssetManager";
import { EntityRenderer } from "../../entities/EntityRenderer";
import { GridWorld } from "../../grid/GridWorld";
import { SelectionManager } from "../../selection/SelectionManager";
import { Layer } from "./Layer";

export class TokenLayer extends Layer {
    private tokenContainers = new Map<string, Container>();

    constructor(
        private gridWorld: GridWorld,
        private assets: AssetManager,
        private selection: SelectionManager
    ) {
        super();
    }

    async render(
        entities: Entity[]
    ): Promise<void> {
        this.clear();
        this.tokenContainers.clear();

        const renderer =
            new EntityRenderer(
                this.gridWorld,
                this.assets
            );

        for (const entity of entities) {
            const tokenContainer =
                await renderer.renderEntity(
                    entity,
                    selectedEntity => {
                        this.selection.select(selectedEntity);
                        this.redrawSelection();
                    }
                );

            this.tokenContainers.set(
                entity.id,
                tokenContainer
            );

            this.container.addChild(tokenContainer);
        }

        this.redrawSelection();
    }

    private redrawSelection(): void {
        for (const [entityId, container] of this.tokenContainers) {
            const oldSelection =
                container.getChildByName("selection-outline");

            if (oldSelection) {
                container.removeChild(oldSelection);
            }

            if (!this.selection.isSelected(entityId)) continue;

            const outline = new Graphics();

            outline.name = "selection-outline";

            outline.rect(
                0,
                0,
                this.gridWorld.cellSize,
                this.gridWorld.cellSize
            );

            outline.stroke({
                width: 3,
                color: 0x22c55e
            });

            container.addChild(outline);
        }
    }
}