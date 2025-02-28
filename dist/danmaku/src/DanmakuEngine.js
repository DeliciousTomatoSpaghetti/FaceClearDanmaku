var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DanmakuEngine_instances, _DanmakuEngine_initTracks;
import { Track } from "./Track";
export class DanmakuEngine {
    constructor(container, options) {
        _DanmakuEngine_instances.add(this);
        this.tracks = [];
        this.cacheStack = [];
        this.isPlaying = false;
        this.interval = null;
        this.container = container;
        __classPrivateFieldGet(this, _DanmakuEngine_instances, "m", _DanmakuEngine_initTracks).call(this);
    }
    startPlaying() {
        this.isPlaying = true;
        this.interval = setInterval(() => {
            if (this.cacheStack.length) {
                const text = this.cacheStack.shift();
                if (text) {
                    const track = this.tracks.find(track => !track.isLocked);
                    if (track) {
                        track.send(text);
                    }
                }
            }
        }, 500);
    }
    stopPlaying() {
        this.isPlaying = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    send(text) {
        this.cacheStack.push(text);
    }
}
_DanmakuEngine_instances = new WeakSet(), _DanmakuEngine_initTracks = function _DanmakuEngine_initTracks() {
    const trackCount = 5;
    for (let i = 0; i < trackCount; i++) {
        const track = new Track({
            height: 32,
            width: this.container.clientWidth,
            index: i
        });
        this.tracks.push(track);
    }
};
