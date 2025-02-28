export type TrackOptions = {
    height: number;
    width: number;
    index: number;
};
export declare class Track {
    height: number;
    width: number;
    index: number;
    isLocked: boolean;
    constructor(trackOptions: TrackOptions);
    send(text: string): void;
}
