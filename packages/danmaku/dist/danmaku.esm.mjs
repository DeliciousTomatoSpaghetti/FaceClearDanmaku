// packages/danmaku/src/Danmaku.ts
var Danmaku = class {
  element;
  parentTrack;
  animationID = null;
  constructor(track, text) {
    this.parentTrack = track;
    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.left = `${this.parentTrack.width}px`;
    this.element.style.top = `${this.parentTrack.index * this.parentTrack.height}px`;
    this.element.innerText = text;
    this.parentTrack.container.appendChild(this.element);
  }
  startMove() {
    let p = 0;
    const run = () => {
      this.animationID = requestAnimationFrame(() => {
        this.element.style.transform = `translateX(${p}px)`;
        p = p - 0.5;
        run();
      });
    };
    run();
  }
  stopMove() {
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
      this.animationID = null;
    }
  }
};

// packages/danmaku/src/Track.ts
var Track = class {
  height;
  width;
  index;
  container;
  isLocked = false;
  constructor(trackOptions) {
    this.height = trackOptions.height;
    this.width = trackOptions.width;
    this.index = trackOptions.index;
    this.container = trackOptions.container;
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
  constructor(parentContainer, options) {
    this.container = document.createElement("div");
    this.container.style.position = "relative";
    this.container.style.height = "100%";
    this.container.style.width = "100%";
    parentContainer.appendChild(this.container);
    this.container.style.backgroundColor = "transparent";
    this.#initTracks();
  }
  startPlaying() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    this.interval = setInterval(() => {
      console.log("interval", this.cacheStack);
      if (this.cacheStack.length) {
        const text = this.cacheStack.shift();
        if (text) {
          const track = this.tracks.find((track2) => !track2.isLocked);
          if (track) {
            console.log(track);
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
        index: i,
        container: this.container
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
export {
  Danmaku,
  DanmakuEngine,
  Track,
  hello
};
//# sourceMappingURL=danmaku.esm.mjs.map
