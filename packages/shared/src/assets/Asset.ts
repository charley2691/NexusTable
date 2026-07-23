export type AssetType =
    | "map"
    | "token"
    | "icon"
    | "portrait"
    | "handout"
    | "effect"
    | "audio"
    | "other";

export type AssetScope =
    | "personal"
    | "shared";

export type AssetStatus =
    | "pending"
    | "approved"
    | "quarantined"
    | "rejected"
    | "archived";

export interface Asset {
    id: string;
    type: AssetType;
    name: string;

    /**
     * Determines whether the asset belongs to one user
     * or is available through the shared asset library.
     */
    scope: AssetScope;

    /**
     * The user who owns the asset.
     *
     * For personal assets, this is normally the player who
     * uploaded their character token or portrait.
     */
    ownerUserId: string;

    /**
     * The user who originally uploaded the asset.
     */
    uploadedByUserId: string;

    /**
     * Internal server-side storage reference.
     *
     * This replaces the old `path` property. It should not be
     * treated as a public URL or stored in portable campaign files.
     */
    storageKey: string;

    mimeType: string;
    sizeBytes: number;

    tags: string[];

    status: AssetStatus;

    createdAt: string;
    updatedAt: string;
}