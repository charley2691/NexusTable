import type { Asset } from "../assets/Asset";
import type { Scene } from "../scene/Scene";

export interface CampaignMetadata {
    createdAt: string;
    updatedAt: string;
}

export interface Campaign {
    version: number;

    id: string;
    name: string;

    scenes: Scene[];
    assets: Asset[];

    activeSceneId?: string;

    metadata: CampaignMetadata;

    extensions: Record<string, unknown>;
}