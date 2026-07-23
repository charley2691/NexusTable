import type {
    Capability,
    PermissionContext,
    PermissionDecision,
} from "@nexustable/shared";

export class PermissionService {
    public check(
        capability: Capability,
        context: PermissionContext,
    ): PermissionDecision {
        const pluginDecision =
            this.checkPluginCapability(capability, context);

        if (!pluginDecision.allowed) {
            return pluginDecision;
        }

        switch (capability) {
            case "assets.read.shared":
                return this.canReadSharedAsset(context);

            case "assets.read.personal":
                return this.canReadPersonalAsset(context);

            case "assets.upload.personal":
                return this.canUploadPersonalAsset(context);

            case "assets.upload.shared":
                return this.canUploadSharedAsset(context);

            case "assets.manage.own":
                return this.canManageOwnAsset(context);

            case "assets.attach.campaign":
                return this.canAttachAssetToCampaign(context);

            case "assets.moderate":
                return this.canModerateAssets(context);

            case "assets.delete.shared":
                return this.canDeleteSharedAsset(context);

            case "campaign.read":
                return this.canReadCampaign(context);

            case "campaign.write":
                return this.canWriteCampaign(context);

            case "users.manage.trust":
                return this.canManageTrust(context);

            default:
                return {
                    allowed: false,
                    reason: "unknown-capability",
                };
        }
    }

    /**
     * Determines the moderation status assigned by the server
     * when a user uploads a shared asset.
     */
    public getInitialSharedAssetStatus(
        context: PermissionContext,
    ): "pending" | "approved" {
        if (
            context.role === "server-owner" ||
            context.role === "moderator" ||
            context.uploadTrustLevel === "trusted"
        ) {
            return "approved";
        }

        return "pending";
    }

    private checkPluginCapability(
        capability: Capability,
        context: PermissionContext,
    ): PermissionDecision {
        if (!context.plugin) {
            return { allowed: true };
        }

        const declared =
            context.plugin.declaredCapabilities.includes(
                capability,
            );

        if (!declared) {
            return {
                allowed: false,
                reason: "plugin-capability-not-declared",
            };
        }

        return { allowed: true };
    }

    private canReadSharedAsset(
        context: PermissionContext,
    ): PermissionDecision {
        const status = context.asset?.assetStatus;

        if (
            context.role === "moderator" ||
            context.role === "server-owner"
        ) {
            return { allowed: true };
        }

        if (status === "approved") {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "shared-asset-access-denied",
        };
    }

    private canReadPersonalAsset(
        context: PermissionContext,
    ): PermissionDecision {
        const assetOwnerUserId =
            context.asset?.assetOwnerUserId;

        if (assetOwnerUserId === context.userId) {
            return { allowed: true };
        }

        if (
            context.role === "moderator" ||
            context.role === "server-owner"
        ) {
            return { allowed: true };
        }

        const campaign = context.campaign;

        if (!campaign?.isAssetAttachedToCampaign) {
            return {
                allowed: false,
                reason: "asset-not-attached-to-campaign",
            };
        }

        if (
            campaign.isCampaignGm ||
            campaign.isCampaignMember
        ) {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "personal-asset-access-denied",
        };
    }

    private canUploadPersonalAsset(
        _context: PermissionContext,
    ): PermissionDecision {
        /**
         * Every authenticated NexusTable user can upload
         * personal character assets.
         */
        return { allowed: true };
    }

    private canUploadSharedAsset(
        context: PermissionContext,
    ): PermissionDecision {
        if (
            context.role === "gm" ||
            context.role === "moderator" ||
            context.role === "server-owner"
        ) {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "gm-role-required",
        };
    }

    private canManageOwnAsset(
        context: PermissionContext,
    ): PermissionDecision {
        if (
            context.asset?.assetOwnerUserId ===
            context.userId
        ) {
            return { allowed: true };
        }

        if (context.role === "server-owner") {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "asset-owner-required",
        };
    }

    private canAttachAssetToCampaign(
        context: PermissionContext,
    ): PermissionDecision {
        if (!context.campaign?.isCampaignGm) {
            return {
                allowed: false,
                reason: "campaign-gm-required",
            };
        }

        return { allowed: true };
    }

    private canModerateAssets(
        context: PermissionContext,
    ): PermissionDecision {
        if (
            context.role === "moderator" ||
            context.role === "server-owner"
        ) {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "moderator-role-required",
        };
    }

    private canDeleteSharedAsset(
        context: PermissionContext,
    ): PermissionDecision {
        if (context.role === "server-owner") {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "server-owner-role-required",
        };
    }

    private canReadCampaign(
        context: PermissionContext,
    ): PermissionDecision {
        if (
            context.role === "moderator" ||
            context.role === "server-owner"
        ) {
            return { allowed: true };
        }

        if (context.campaign?.isCampaignMember) {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "campaign-membership-required",
        };
    }

    private canWriteCampaign(
        context: PermissionContext,
    ): PermissionDecision {
        if (
            context.role === "server-owner" ||
            context.campaign?.isCampaignGm
        ) {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "campaign-gm-required",
        };
    }

    private canManageTrust(
        context: PermissionContext,
    ): PermissionDecision {
        if (context.role === "server-owner") {
            return { allowed: true };
        }

        return {
            allowed: false,
            reason: "server-owner-role-required",
        };
    }
}