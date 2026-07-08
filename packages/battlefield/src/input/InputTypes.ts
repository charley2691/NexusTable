export interface PointerPosition {
    x: number;
    y: number;
}

export interface PointerState {
    position: PointerPosition;
    previousPosition: PointerPosition;
    isDown: boolean;
    button: number | null;
}