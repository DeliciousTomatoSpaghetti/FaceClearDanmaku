import { Track } from "./Track";
export declare class Danmaku {
    element: HTMLElement;
    parentTrack: Track;
    animationID: number | null;
    constructor(track: Track, text: string);
    startMove(): void;
    stopMove(): void;
}
