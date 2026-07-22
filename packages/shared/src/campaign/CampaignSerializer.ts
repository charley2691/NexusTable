import type { Campaign } from "./Campaign";

export class CampaignSerializer {
    public static serialize(
        campaign: Campaign
    ): string {
        return JSON.stringify(
            campaign,
            null,
            2
        );
    }

    public static deserialize(
        json: string
    ): Campaign {
        let parsed: unknown;

        try {
            parsed = JSON.parse(json);
        } catch {
            throw new Error(
                "Campaign data contains invalid JSON."
            );
        }

        return this.validateAndNormalize(
            parsed
        );
    }

    public static clone(
        campaign: Campaign
    ): Campaign {
        return this.deserialize(
            this.serialize(campaign)
        );
    }

    private static validateAndNormalize(
        data: unknown
    ): Campaign {
        if (!this.isRecord(data)) {
            throw new Error(
                "Campaign data must be an object."
            );
        }

        if (
            typeof data.id !== "string" ||
            data.id.trim().length === 0
        ) {
            throw new Error(
                "Campaign must have a valid id."
            );
        }

        if (
            typeof data.name !== "string" ||
            data.name.trim().length === 0
        ) {
            throw new Error(
                "Campaign must have a valid name."
            );
        }

        if (!Array.isArray(data.scenes)) {
            throw new Error(
                "Campaign scenes must be an array."
            );
        }

        const version =
            typeof data.version === "number"
                ? data.version
                : 1;

        const assets =
            Array.isArray(data.assets)
                ? data.assets
                : [];

        const activeSceneId =
            typeof data.activeSceneId ===
            "string"
                ? data.activeSceneId
                : undefined;

        const metadata =
            this.normalizeMetadata(
                data.metadata
            );

        const extensions =
            this.isRecord(data.extensions)
                ? data.extensions
                : {};

        return {
            version,
            id: data.id,
            name: data.name,
            scenes: data.scenes,
            assets,
            activeSceneId,
            metadata,
            extensions
        } as Campaign;
    }

    private static normalizeMetadata(
        metadata: unknown
    ): Campaign["metadata"] {
        const now =
            new Date().toISOString();

        if (!this.isRecord(metadata)) {
            return {
                createdAt: now,
                updatedAt: now
            };
        }

        return {
            createdAt:
                typeof metadata.createdAt ===
                "string"
                    ? metadata.createdAt
                    : now,

            updatedAt:
                typeof metadata.updatedAt ===
                "string"
                    ? metadata.updatedAt
                    : now
        };
    }

    private static isRecord(
        value: unknown
    ): value is Record<string, unknown> {
        return (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
        );
    }
}