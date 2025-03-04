import '@tensorflow/tfjs-backend-webgl';
import { Track } from "./Track";
import { Danmaku } from "./Danmaku";
export type DanmakuEngineOptions = {
    antiOcclusion?: boolean;
};
export declare const danmakuSet: Set<Danmaku>;
export declare class DanmakuEngine {
    #private;
    container: HTMLElement;
    videoElement: HTMLVideoElement | null;
    tracks: Track[];
    cacheStack: string[];
    isPlaying: boolean;
    interval: number | null;
    constructor(parentContainer: HTMLElement, videoElement: HTMLVideoElement, options: DanmakuEngineOptions);
    startPlaying(): void;
    stopPlaying(): void;
    send(text: string): void;
    pause(): void;
    startBodySegmentation(): void;
    videoProcess(): Promise<void>;
}
