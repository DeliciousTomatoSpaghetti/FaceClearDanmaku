import { Track } from "./Track";
export type DanmakuEngineOptions = {
    antiOcclusion?: boolean;
};
export declare class DanmakuEngine {
    #private;
    container: HTMLElement;
    tracks: Track[];
    cacheStack: string[];
    isPlaying: boolean;
    interval: number | null;
    constructor(container: HTMLElement, options: DanmakuEngineOptions);
    startPlaying(): void;
    stopPlaying(): void;
    send(text: string): void;
}
