import { Container } from "pixi.js";
import { Scene } from "@nexustable/shared";
import { AssetManager } from "../assets/AssetManager";
import { Grid } from "../grid/Grid";
import { GridWorld } from "../grid/GridWorld";
import { GridLayer } from "./layers/GridLayer";
import { TokenLayer } from "./layers/TokenLayer";

export class SceneRenderer {
    private container = new Container();

    private gridLayer: GridLayer;
    private tokenLayer: TokenLayer;

    constructor(
        private assets: AssetManager
    ) {
        const grid = this.getDefaultGrid();
        const gridWorld = new GridWorld(grid.cellSize);

        this.gridLayer = new GridLayer();

        this.tokenLayer =
            new TokenLayer(
                gridWorld,
                this.assets
            );

        this.container.addChild(
            this.gridLayer.getContainer()
        );

        this.container.addChild(
            this.tokenLayer.getContainer()
        );
    }

    getContainer(): Container {
        return this.container;
    }

    async render(scene: Scene): Promise<void> {
        const grid = this.getGridFromScene(scene);
        const gridWorld = new GridWorld(grid.cellSize);

        this.gridLayer.render(grid);

        this.tokenLayer =
            new TokenLayer(
                gridWorld,
                this.assets
            );

        this.container.addChild(
            this.tokenLayer.getContainer()
        );

        await this.tokenLayer.render(
            scene.entities
        );
    }

    private getGridFromScene(scene: Scene): Grid {
        const gridMetadata = scene.metadata.grid as
            | {
                width?: number;
                height?: number;
                cellSize?: number;
            }
            | undefined;

        return new Grid(
            gridMetadata?.width ?? 20,
            gridMetadata?.height ?? 20,
            gridMetadata?.cellSize ?? 50
        );
    }

    private getDefaultGrid(): Grid {
        return new Grid(
            20,
            20,
            50
        );
    }
}