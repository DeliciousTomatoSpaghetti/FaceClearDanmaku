import { Track } from "./Track";
type DanmakuPosition = {
    x: number;
    y: number;
};
type DanmakuRect = {
    width: number;
    height: number;
};
export declare class Danmaku {
    #private;
    element: HTMLElement | null;
    parentTrack: Track | null;
    animationID: number | null;
    position: DanmakuPosition | null;
    rect: DanmakuRect | null;
    speedPerFrame: number;
    currX: number;
    isPaused: boolean;
    private emitter;
    constructor(track: Track, text: string);
    startMove(): void;
    stopMove(): void;
    destroy(): void;
    onStartShow(fn: () => any): void;
    onCompleteShow(fn: () => any): void;
    beforeDestroy(fn: () => any): void;
}
export {};
