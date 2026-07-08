import { Container } from "pixi.js";

export abstract class Layer {
    protected container = new Container();

    getContainer(): Container {
        return this.container;
    }

    setVisible(visible: boolean): void {
        this.container.visible = visible;
    }

    clear(): void {
        this.container.removeChildren();
    }
}