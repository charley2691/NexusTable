export type UserRole =
    | "user"
    | "gm"
    | "moderator"
    | "server-owner";

export type UploadTrustLevel =
    | "standard"
    | "trusted";

export interface UserPermissionProfile {
    userId: string;
    role: UserRole;
    uploadTrustLevel: UploadTrustLevel;
}