import { Container, Graphics, Point } from "pixi.js";
import { Entity } from "@nexustable/shared";
import { EventBus } from "@nexustable/game-engine";
import { AssetManager } from "../../assets/AssetManager";
import { EntityRenderer } from "../../entities/EntityRenderer";
import { GridWorld } from "../../grid/GridWorld";
import { SelectionManager } from "../../selection/SelectionManager";
import { Layer } from "./Layer";

export class TokenLayer extends Layer {
    private tokenContainers = new Map<string, Container>();

    private dragOffsets = new Map<
        string,
        {
            x: number;
            y: number;
        }
    >();

    constructor(
        private gridWorld: GridWorld,
        private assets: AssetManager,
        private selection: SelectionManager,
        private eventBus: EventBus
    ) {
        super();

        this.eventBus.on("drag.started", (event) => {
            const data = event as {
                entityId: string;
                x: number;
                y: number;
            };

            this.startDrag(
                data.entityId,
                data.x,
                data.y
            );
        });

        this.eventBus.on("drag.preview", (event) => {
            const data = event as {
                entityId: string;
                x: number;
                y: number;
            };

            this.moveTokenFromScreen(
                data.entityId,
                data.x,
                data.y
            );
        });

        this.eventBus.on("drag.finished", (event) => {
            const data = event as {
                entityId: string;
            };

            this.dragOffsets.delete(data.entityId);
        });

        this.eventBus.on("selection.cleared", () => {
            this.redrawSelection();
        });
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

    private startDrag(
        entityId: string,
        screenX: number,
        screenY: number
    ): void {
        const token =
            this.tokenContainers.get(entityId);

        if (!token) return;

        const local =
            this.container.toLocal(
                new Point(screenX, screenY)
            );

        this.dragOffsets.set(entityId, {
            x: local.x - token.x,
            y: local.y - token.y
        });
    }

    private moveTokenFromScreen(
        entityId: string,
        screenX: number,
        screenY: number
    ): void {
        const token =
            this.tokenContainers.get(entityId);

        if (!token) return;

        const local =
            this.container.toLocal(
                new Point(screenX, screenY)
            );

        const offset =
            this.dragOffsets.get(entityId) ?? {
                x: this.gridWorld.cellSize / 2,
                y: this.gridWorld.cellSize / 2
            };

        token.x = local.x - offset.x;
        token.y = local.y - offset.y;
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