import { Entity } from "../entity/Entity.js";
import { CameraSettings } from "./CameraSettings.js";
import { GridSettings } from "./GridSettings.js";
import { MapReference } from "./MapReference.js";

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