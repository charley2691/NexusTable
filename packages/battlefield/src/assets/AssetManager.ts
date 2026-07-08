import { Asset } from "@nexustable/shared";

export class AssetManager {
    private assets = new Map<string, Asset>();

    register(asset: Asset): void {
        this.assets.set(asset.id, asset);
    }

    get(assetId: string): Asset | undefined {
        return this.assets.get(assetId);
    }

    getByType(type: Asset["type"]): Asset[] {
        return Array.from(this.assets.values())
            .filter(asset => asset.type === type);
    }

    getAll(): Asset[] {
        return Array.from(this.assets.values());
    }
}