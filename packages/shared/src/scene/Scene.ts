import { Entity } from "../entity/Entity";
import { CameraSettings } from "./CameraSettings";
import { GridSettings } from "./GridSettings";
import { MapReference } from "./MapReference";

export interface Scene {
    version: number;

    id: string;
    name: string;

    grid: GridSettings;

    camera: CameraSettings;

    map?: MapReference;

    entities: Entity[];

    metadata: Record<string, unknown>;
}