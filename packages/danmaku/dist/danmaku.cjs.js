"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/danmaku/src/index.ts
var index_exports = {};
__export(index_exports, {
  Danmaku: () => Danmaku,
  DanmakuEngine: () => DanmakuEngine,
  Track: () => Track,
  hello: () => hello
});
module.exports = __toCommonJS(index_exports);

// packages/danmaku/src/Danmaku.ts
var Danmaku = class {
  element;
  parentTrack;
  constructor(track, text) {
    this.parentTrack = track;
    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.left = `${this.parentTrack.width}px`;
    this.element.style.top = `${this.parentTrack.index * this.parentTrack.height}px`;
    this.element.innerText = text;
  }
  startMove() {
    this.element.style.transition = `transform 5s linear`;
    this.element.style.transform = `translateX(-${this.parentTrack.width}px)`;
  }
};

// packages/danmaku/src/Track.ts
var Track = class {
  height;
  width;
  index;
  isLocked = false;
  constructor(trackOptions) {
    this.height = trackOptions.height;
    this.width = trackOptions.width;
    this.index = trackOptions.index;
  }
  send(text) {
    this.isLocked = true;
    const danmaku = new Danmaku(this, text);
    danmaku.startMove();
  }
};

// packages/danmaku/src/DanmakuEngine.ts
var DanmakuEngine = class {
  container;
  tracks = [];
  cacheStack = [];
  isPlaying = false;
  interval = null;
  constructor(container, options) {
    this.container = container;
    this.#initTracks();
  }
  startPlaying() {
    this.isPlaying = true;
    this.interval = setInterval(() => {
      console.log("interval", this.cacheStack);
      if (this.cacheStack.length) {
        const text = this.cacheStack.shift();
        if (text) {
          const track = this.tracks.find((track2) => !track2.isLocked);
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
  #initTracks() {
    const trackCount = 5;
    for (let i = 0; i < trackCount; i++) {
      const track = new Track({
        height: 32,
        width: this.container.clientWidth,
        index: i
      });
      this.tracks.push(track);
    }
  }
};

// packages/danmaku/src/index.ts
function hello(word) {
  console.log("hello123");
  return word;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Danmaku,
  DanmakuEngine,
  Track,
  hello
});
//# sourceMappingURL=danmaku.cjs.js.map
