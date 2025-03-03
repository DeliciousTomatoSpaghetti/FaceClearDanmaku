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
    constructor(trackOptions: TrackOptions);
    send(text: string): void;
}
