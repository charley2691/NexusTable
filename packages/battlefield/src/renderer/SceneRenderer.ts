import { Container } from "pixi.js";
import { Scene } from "@nexustable/shared";
import { AssetManager } from "../assets/AssetManager";
import { Grid } from "../grid/Grid";
import { GridWorld } from "../grid/GridWorld";
import { MapLayer } from "./layers/MapLayer";
import { GridLayer } from "./layers/GridLayer";
import { TokenLayer } from "./layers/TokenLayer";

export class SceneRenderer {
    private container = new Container();

    private mapLayer: MapLayer;
    private gridLayer: GridLayer;
    private tokenLayer: TokenLayer;

    constructor(
        private assets: AssetManager
    ) {
        const grid = this.getDefaultGrid();
        const gridWorld = new GridWorld(grid.cellSize);

        this.mapLayer = new MapLayer(this.assets);
        this.gridLayer = new GridLayer();

        this.tokenLayer =
            new TokenLayer(
                gridWorld,
                this.assets
            );

        this.container.addChild(
            this.mapLayer.getContainer()
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

        await this.mapLayer.render(scene.map);

        this.gridLayer.render(grid);

        this.tokenLayer.clear();

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
        return new Grid(
            scene.grid.width,
            scene.grid.height,
            scene.grid.cellSize
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