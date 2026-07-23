export type CampaignAssetPurpose =
    | "player-character"
    | "map"
    | "creature"
    | "portrait"
    | "handout"
    | "audio"
    | "effect"
    | "other";

export interface CampaignAssetReference {
    assetId: string;
    purpose: CampaignAssetPurpose;

    /**
     * The user who attached the asset to the campaign.
     */
    addedByUserId: string;

    /**
     * Used for personal assets such as player-character tokens.
     */
    ownerUserId?: string;

    /**
     * Optional link to a future character record.
     */
    characterId?: string;

    addedAt: string;
}