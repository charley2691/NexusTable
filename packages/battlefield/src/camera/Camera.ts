import { Container } from "pixi.js";

export class Camera {
    readonly container: Container;

    private zoom = 1;

    constructor() {
        this.container = new Container();
    }

    move(x: number, y: number) {
        this.container.position.set(x, y);
    }

    setZoom(value: number) {
        this.zoom = value;

        this.container.scale.set(
            this.zoom,
            this.zoom
        );
    }

    getZoom() {
        return this.zoom;
    }
}