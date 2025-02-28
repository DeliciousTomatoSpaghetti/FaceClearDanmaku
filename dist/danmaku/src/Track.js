import { Danmaku } from "./Danmaku";
export class Track {
    constructor(trackOptions) {
        this.isLocked = false;
        this.height = trackOptions.height;
        this.width = trackOptions.width;
        this.index = trackOptions.index;
    }
    send(text) {
        this.isLocked = true;
        const danmaku = new Danmaku(this, text);
        danmaku.startMove();
    }
}
