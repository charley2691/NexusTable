export interface Entity {
  id: string;
  components: Component[];
}


export interface Component {
  type: string;
  data: Record<string, unknown>;
}


export interface Scene {
  id: string;
  name: string;
  entities: Entity[];
  metadata: Record<string, unknown>;
}


export interface Position {
  x: number;
  y: number;
}


export interface GridPosition {
  x: number;
  y: number;
}


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