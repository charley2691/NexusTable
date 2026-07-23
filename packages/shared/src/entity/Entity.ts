import { Component } from "./Component.js";

export interface Entity {
    id: string;
    components: Component[];
}