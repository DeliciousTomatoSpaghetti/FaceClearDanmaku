// packages/danmaku/src/utils/EventEmitter.ts
var EventEmitter = class {
  // 存储事件及其对应的回调函数列表
  events = {};
  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  // 只订阅一次事件，触发后自动取消订阅
  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }
  // 取消订阅事件
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
    }
  }
  // 发布事件
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback(...args);
      });
    }
  }
};

// packages/danmaku/src/Danmaku.ts
var Danmaku = class {
  element = null;
  parentTrack = null;
  animationID = null;
  position = null;
  rect = null;
  speedPerFrame = getRandomWithinTenPercent(0.5);
  currX = 0;
  isPaused = false;
  emitter = new EventEmitter();
  constructor(track, text) {
    this.#initDanmaku(track, text);
    danmakuSet.add(this);
  }
  #initDanmaku(track, text) {
    this.parentTrack = track;
    this.position = {
      x: this.parentTrack.width,
      y: this.parentTrack.index * this.parentTrack.height
    };
    this.element = document.createElement("div");
    this.element.innerText = text;
    this.parentTrack.container.appendChild(this.element);
    this.rect = {
      width: this.element.clientWidth,
      height: this.element.clientHeight
    };
    this.element.style.position = "absolute";
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;
    this.element.style.pointerEvents = "auto";
  }
  startMove() {
    this.isPaused = false;
    const run = () => {
      this.animationID = requestAnimationFrame(() => {
        if (!this.element || !this.parentTrack || !this.rect) return;
        this.element.style.transform = `translateX(${this.currX}px)`;
        this.currX -= this.speedPerFrame;
        if (this.currX < -this.rect.width - 30) {
          this.emitter.emit("completeShow");
        }
        if (this.currX < -this.parentTrack.width - this.rect.width - 50) {
          this.destroy();
          return;
        }
        run();
      });
    };
    run();
  }
  stopMove() {
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
      this.animationID = null;
      this.isPaused = true;
    }
  }
  destroy() {
    this.emitter.emit("beforeDestroy");
    this.stopMove();
    this.element?.remove();
    danmakuSet.delete(this);
  }
  onCompleteShow(fn) {
    this.emitter.once("completeShow", fn);
  }
  beforeDestroy(fn) {
    this.emitter.on("beforeDestroy", fn);
  }
};
function getRandomWithinTenPercent(num) {
  const tenPercent = num * 0.1;
  const randomOffset = Math.random() * (2 * tenPercent) - tenPercent;
  return num + randomOffset;
}

// packages/danmaku/src/Track.ts
var Track = class {
  height;
  width;
  index;
  container;
  isLocked = false;
  trackDanmakuSet = /* @__PURE__ */ new Set();
  lastDanmaku = null;
  constructor(trackOptions) {
    this.height = trackOptions.height;
    this.width = trackOptions.width;
    this.index = trackOptions.index;
    this.container = trackOptions.container;
  }
  send(text) {
    this.isLocked = true;
    const danmaku = new Danmaku(this, text);
    if (this.lastDanmaku) {
      const leftTime = (this.width + this.lastDanmaku.currX + this.lastDanmaku.rect.width) / this.lastDanmaku.speedPerFrame;
      const newLeftTime = this.width / danmaku.speedPerFrame;
      if (leftTime > newLeftTime) {
        danmaku.speedPerFrame = this.lastDanmaku.speedPerFrame;
      }
    }
    this.lastDanmaku = danmaku;
    this.trackDanmakuSet.add(danmaku);
    danmaku.startMove();
    danmaku.onCompleteShow(
      () => {
        this.isLocked = false;
        console.log("\u89E3\u9501");
      }
    );
    danmaku.beforeDestroy(() => {
      this.trackDanmakuSet.delete(danmaku);
      console.log("\u5220\u9664");
    });
  }
};

// packages/danmaku/src/DanmakuEngine.ts
var danmakuSet = /* @__PURE__ */ new Set();
var DanmakuEngine = class {
  container;
  tracks = [];
  cacheStack = [];
  isPlaying = false;
  interval = null;
  constructor(parentContainer, options) {
    this.container = document.createElement("div");
    parentContainer.style.position = "relative";
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.zIndex = "1000";
    this.container.style.height = "100%";
    this.container.style.width = "100%";
    this.container.style.display = "flex";
    this.container.style.pointerEvents = "none";
    parentContainer.appendChild(this.container);
    this.#initTracks();
  }
  startPlaying() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    danmakuSet.forEach((danmaku) => {
      danmaku.startMove();
    });
    this.interval = setInterval(() => {
      if (this.cacheStack.length) {
        const text = this.cacheStack.shift();
        if (text) {
          const track = this.tracks.find((track2) => !track2.isLocked);
          if (track) {
            track.send(text);
          }
        }
      }
    }, 300);
  }
  stopPlaying() {
    this.isPlaying = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    danmakuSet.forEach((danmaku) => {
      danmaku.stopMove();
    });
  }
  send(text) {
    this.cacheStack.push(text);
  }
  pause() {
    danmakuSet.forEach((danmaku) => {
      danmaku.stopMove();
    });
    this.isPlaying = false;
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
  danmakuSet,
  hello
};
//# sourceMappingURL=danmaku.esm.mjs.map
