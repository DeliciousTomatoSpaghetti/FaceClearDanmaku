import { Track } from "./Track";
export declare class Danmaku {
    element: HTMLElement;
    parentTrack: Track;
    constructor(track: Track, text: string);
    startMove(): void;
}
