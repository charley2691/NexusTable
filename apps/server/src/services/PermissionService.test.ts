import assert from "node:assert/strict";

import type {
    PermissionContext,
} from "@nexustable/shared";

import {
    PermissionService,
} from "./PermissionService";

const permissions = new PermissionService();

function makeContext(
    overrides: Partial<PermissionContext> = {},
): PermissionContext {
    return {
        userId: "user-1",
        role: "user",
        uploadTrustLevel: "standard",
        ...overrides,
    };
}

function expectAllowed(
    name: string,
    result: { allowed: boolean },
): void {
    assert.equal(
        result.allowed,
        true,
        `${name} should be allowed`,
    );

    console.log(`✓ ${name}`);
}

function expectDenied(
    name: string,
    result: { allowed: boolean },
): void {
    assert.equal(
        result.allowed,
        false,
        `${name} should be denied`,
    );

    console.log(`✓ ${name}`);
}

/**
 * Regular users can upload personal character tokens.
 */
expectAllowed(
    "regular user uploads a personal asset",
    permissions.check(
        "assets.upload.personal",
        makeContext(),
    ),
);

/**
 * Regular users cannot upload directly to the shared pool.
 */
expectDenied(
    "regular user uploads a shared asset",
    permissions.check(
        "assets.upload.shared",
        makeContext(),
    ),
);

/**
 * A standard GM may upload to the shared pool,
 * but the resulting asset starts pending.
 */
const standardGm = makeContext({
    role: "gm",
});

expectAllowed(
    "standard GM uploads a shared asset",
    permissions.check(
        "assets.upload.shared",
        standardGm,
    ),
);

assert.equal(
    permissions.getInitialSharedAssetStatus(
        standardGm,
    ),
    "pending",
);

console.log(
    "✓ standard GM shared upload starts pending",
);

/**
 * A trusted GM's shared upload is approved immediately.
 */
const trustedGm = makeContext({
    role: "gm",
    uploadTrustLevel: "trusted",
});

assert.equal(
    permissions.getInitialSharedAssetStatus(
        trustedGm,
    ),
    "approved",
);

console.log(
    "✓ trusted GM shared upload starts approved",
);

/**
 * Campaign GM can read a player's attached personal token.
 */
expectAllowed(
    "campaign GM reads attached player token",
    permissions.check(
        "assets.read.personal",
        makeContext({
            userId: "gm-1",
            role: "gm",
            campaign: {
                campaignId: "campaign-1",
                isCampaignMember: true,
                isCampaignGm: true,
                isAssetAttachedToCampaign: true,
            },
            asset: {
                assetId: "asset-player-token",
                assetScope: "personal",
                assetStatus: "approved",
                assetOwnerUserId: "player-1",
            },
        }),
    ),
);

/**
 * An unrelated GM cannot read the same token.
 */
expectDenied(
    "unrelated GM reads player token",
    permissions.check(
        "assets.read.personal",
        makeContext({
            userId: "unrelated-gm",
            role: "gm",
            campaign: {
                campaignId: "campaign-2",
                isCampaignMember: false,
                isCampaignGm: false,
                isAssetAttachedToCampaign: false,
            },
            asset: {
                assetId: "asset-player-token",
                assetScope: "personal",
                assetStatus: "approved",
                assetOwnerUserId: "player-1",
            },
        }),
    ),
);

/**
 * Moderator can quarantine or approve assets.
 */
expectAllowed(
    "moderator moderates shared asset",
    permissions.check(
        "assets.moderate",
        makeContext({
            role: "moderator",
        }),
    ),
);

/**
 * Trusted status does not grant moderation power.
 */
expectDenied(
    "trusted GM moderates shared asset",
    permissions.check(
        "assets.moderate",
        trustedGm,
    ),
);

/**
 * A plugin cannot use an undeclared capability.
 */
expectDenied(
    "plugin uses undeclared capability",
    permissions.check(
        "assets.read.shared",
        makeContext({
            role: "gm",
            asset: {
                assetId: "asset-map",
                assetScope: "shared",
                assetStatus: "approved",
            },
            plugin: {
                pluginId: "example-plugin",
                declaredCapabilities: [
                    "campaign.read",
                ],
            },
        }),
    ),
);

/**
 * Declaring the capability does not bypass normal
 * resource and user permission checks.
 */
expectDenied(
    "plugin declaration does not bypass user permissions",
    permissions.check(
        "assets.read.personal",
        makeContext({
            role: "gm",
            asset: {
                assetId: "private-player-token",
                assetScope: "personal",
                assetStatus: "approved",
                assetOwnerUserId: "another-user",
            },
            plugin: {
                pluginId: "example-plugin",
                declaredCapabilities: [
                    "assets.read.personal",
                ],
            },
        }),
    ),
);

console.log(
    "\nAll PermissionService tests passed.",
);