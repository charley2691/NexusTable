import type {
    Asset,
    Campaign
} from "@nexustable/shared";

export class AssetManager {
    private assets =
        new Map<string, Asset>();

    private campaign:
        Campaign | null = null;

    attachCampaign(
        campaign: Campaign
    ): void {
        this.campaign = campaign;
    }

    detachCampaign(): void {
        this.campaign = null;
    }

    register(
        asset: Asset
    ): void {
        if (this.campaign) {
            const existingIndex =
                this.campaign.assets.findIndex(
                    existing =>
                        existing.id === asset.id
                );

            if (existingIndex === -1) {
                this.campaign.assets.push(
                    asset
                );
            } else {
                this.campaign.assets[
                    existingIndex
                ] = asset;
            }

            this.touchCampaign();

            return;
        }

        this.assets.set(
            asset.id,
            asset
        );
    }

    get(
        assetId: string
    ): Asset | undefined {
        if (this.campaign) {
            return this.campaign.assets.find(
                asset =>
                    asset.id === assetId
            );
        }

        return this.assets.get(
            assetId
        );
    }

    getByType(
        type: Asset["type"]
    ): Asset[] {
        return this
            .getAll()
            .filter(
                asset =>
                    asset.type === type
            );
    }

    getAll(): Asset[] {
        if (this.campaign) {
            return [
                ...this.campaign.assets
            ];
        }

        return Array.from(
            this.assets.values()
        );
    }

    remove(
        assetId: string
    ): boolean {
        if (this.campaign) {
            const originalLength =
                this.campaign.assets.length;

            this.campaign.assets =
                this.campaign.assets.filter(
                    asset =>
                        asset.id !== assetId
                );

            const removed =
                this.campaign.assets.length !==
                originalLength;

            if (removed) {
                this.touchCampaign();
            }

            return removed;
        }

        return this.assets.delete(
            assetId
        );
    }

    has(
        assetId: string
    ): boolean {
        return (
            this.get(assetId) !==
            undefined
        );
    }

    private touchCampaign(): void {
        if (!this.campaign) {
            return;
        }

        this.campaign.metadata.updatedAt =
            new Date().toISOString();
    }
}