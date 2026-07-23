import type {
    AssetScope,
    AssetStatus,
} from "../assets/index.js";

import type {
    UploadTrustLevel,
    UserRole,
} from "../users/index.js";

export interface CampaignPermissionContext {
    campaignId: string;

    /**
     * Whether the requesting user belongs to this campaign.
     */
    isCampaignMember: boolean;

    /**
     * Whether the requesting user is one of the campaign's GMs.
     */
    isCampaignGm: boolean;

    /**
     * Whether the asset is attached to this campaign.
     */
    isAssetAttachedToCampaign?: boolean;
}

export interface AssetPermissionContext {
    assetId?: string;
    assetScope?: AssetScope;
    assetStatus?: AssetStatus;
    assetOwnerUserId?: string;
}

export interface PluginPermissionContext {
    pluginId: string;

    /**
     * Capabilities declared in the plugin manifest.
     */
    declaredCapabilities: string[];
}

export interface PermissionContext {
    userId: string;
    role: UserRole;
    uploadTrustLevel: UploadTrustLevel;

    campaign?: CampaignPermissionContext;
    asset?: AssetPermissionContext;
    plugin?: PluginPermissionContext;
}