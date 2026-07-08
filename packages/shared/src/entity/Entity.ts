import { Component } from "./Component";

export interface Entity {
    id: string;
    components: Component[];
}