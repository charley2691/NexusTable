import { Assets, Sprite } from "pixi.js";
import { MapReference } from "@nexustable/shared";
import { AssetManager } from "../../assets/AssetManager";
import { Layer } from "./Layer";

export class MapLayer extends Layer {
    constructor(
        private assets: AssetManager
    ) {
        super();
    }

    async render(map?: MapReference): Promise<void> {
        this.clear();

        if (!map || !map.visible) return;

        const asset = this.assets.get(map.assetId);

        if (!asset) return;

        const texture = await Assets.load(asset.path);
        const sprite = new Sprite(texture);

        sprite.x = map.x;
        sprite.y = map.y;
        sprite.width = map.width;
        sprite.height = map.height;
        sprite.rotation = map.rotation;
        sprite.alpha = map.opacity;

        this.container.addChild(sprite);
    }
}