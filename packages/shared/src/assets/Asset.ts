export type AssetType =
    | "map"
    | "token"
    | "icon"
    | "effect"
    | "audio";

export interface Asset {
    id: string;
    type: AssetType;
    name: string;
    path: string;
}