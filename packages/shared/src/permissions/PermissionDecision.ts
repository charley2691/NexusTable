export type PermissionDenialReason =
    | "unknown-capability"
    | "plugin-capability-not-declared"
    | "campaign-membership-required"
    | "campaign-gm-required"
    | "asset-owner-required"
    | "asset-not-attached-to-campaign"
    | "shared-asset-access-denied"
    | "personal-asset-access-denied"
    | "gm-role-required"
    | "moderator-role-required"
    | "server-owner-role-required";

export interface PermissionDecision {
    allowed: boolean;
    reason?: PermissionDenialReason;
}