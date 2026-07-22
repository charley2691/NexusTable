import type {
    Asset,
    Campaign
} from "@nexustable/shared";

export class AssetManager {
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
        const campaign =
            this.requireCampaign();

        const existingIndex =
            campaign.assets.findIndex(
                existing =>
                    existing.id === asset.id
            );

        if (existingIndex === -1) {
            campaign.assets.push(
                asset
            );
        } else {
            campaign.assets[
                existingIndex
            ] = asset;
        }

        this.touchCampaign();
    }

    get(
        assetId: string
    ): Asset | undefined {
        const campaign =
            this.requireCampaign();

        return campaign.assets.find(
            asset =>
                asset.id === assetId
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
        const campaign =
            this.requireCampaign();

        return [
            ...campaign.assets
        ];
    }

    remove(
        assetId: string
    ): boolean {
        const campaign =
            this.requireCampaign();

        const originalLength =
            campaign.assets.length;

        campaign.assets =
            campaign.assets.filter(
                asset =>
                    asset.id !== assetId
            );

        const removed =
            campaign.assets.length !==
                       originalLength;

        if (removed) {
            this.touchCampaign();
        }

        return removed;
    }

    has(
        assetId: string
    ): boolean {
        return (
            this.get(assetId) !==
            undefined
        );
    }

    private requireCampaign(): Campaign {
        if (!this.campaign) {
            throw new Error(
                "AssetManager requires an attached campaign."
            );
        }

        return this.campaign;
    }

    private touchCampaign(): void {
        const campaign =
            this.requireCampaign();

        campaign.metadata.updatedAt =
            new Date().toISOString();
    }
}