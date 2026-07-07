import { FederatedPointerEvent } from "pixi.js";
import { Camera } from "./Camera";

export class CameraController {
    private dragging = false;

    private lastX = 0;
    private lastY = 0;

    constructor(
        private camera: Camera,
        private element: HTMLElement
    ) {
        this.setup();
    }

    private setup() {

        this.element.addEventListener(
            "wheel",
            (event) => {
                event.preventDefault();

                const zoomChange =
                    event.deltaY > 0
                        ? -0.1
                        : 0.1;

                this.camera.setZoom(
                    Math.max(
                        0.2,
                        this.camera.getZoom() + zoomChange
                    )
                );
            }
        );

        this.element.addEventListener(
            "pointerdown",
            (event) => {
                this.dragging = true;

                this.lastX = event.clientX;
                this.lastY = event.clientY;
            }
        );

        this.element.addEventListener(
            "pointerup",
            () => {
                this.dragging = false;
            }
        );

        this.element.addEventListener(
            "pointermove",
            (event) => {

                if (!this.dragging) return;

                const dx =
                    event.clientX - this.lastX;

                const dy =
                    event.clientY - this.lastY;

                this.camera.container.x += dx;
                this.camera.container.y += dy;

                this.lastX = event.clientX;
                this.lastY = event.clientY;
            }
        );
    }
}