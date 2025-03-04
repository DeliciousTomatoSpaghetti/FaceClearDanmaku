import { Danmaku } from "./Danmaku";
export type TrackOptions = {
    height: number;
    width: number;
    index: number;
    container: HTMLElement;
};
export declare class Track {
    height: number;
    width: number;
    index: number;
    container: HTMLElement;
    isLocked: boolean;
    trackDanmakuSet: Set<Danmaku>;
    lastDanmaku: Danmaku | null;
    constructor(trackOptions: TrackOptions);
    send(text: string): void;
}
