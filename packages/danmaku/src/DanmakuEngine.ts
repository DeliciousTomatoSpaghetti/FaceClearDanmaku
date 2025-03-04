import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs-backend-webgl';

import { Track } from "./Track"
import { Danmaku } from "./Danmaku"

import { toDataURLWorker } from './worker/inlineWorker';

import { url } from './base64test';

console.log(toDataURLWorker);

export type DanmakuEngineOptions = {
  antiOcclusion?: boolean
}

export const danmakuSet: Set<Danmaku> = new Set()

export class DanmakuEngine {
  public container: HTMLElement
  public videoElement: HTMLVideoElement | null = null
  public tracks: Track[] = []
  public cacheStack: string[] = []
  public isPlaying: boolean = false
  public interval: number | null = null

  private isProcessingVideo = false

  constructor(parentContainer: HTMLElement, videoElement: HTMLVideoElement, options: DanmakuEngineOptions) {

    this.#initVideoElement(videoElement)
    // console.log(toDataURLWorker);
    this.container = document.createElement('div')
    parentContainer.style.position = 'relative'
    this.container.style.position = 'absolute'
    this.container.style.top = '0'
    this.container.style.left = '0'
    this.container.style.zIndex = '1000'
    this.container.style.height = '100%'
    this.container.style.width = '100%'
    this.container.style.display = 'flex'
    this.container.style.pointerEvents = 'none'
    this.container.style.overflow = 'hidden'

    this.container.style.backgroundImage = `url(${url})`

    parentContainer.appendChild(this.container)
    // this.container.style.webkitMaskBoxImage = `url(${png})`
    // this.container.style.backgroundColor = 'red'
    // this.container.style.maskImage = "url('../public/maskimage2.png')"
    // this.container.style.webkitMaskBoxImage = "url('../public/maskimage2.png')"

    this.#initTracks()

  }

  startPlaying() {
    if (this.isPlaying) return
    this.isPlaying = true

    // 清除之前的轮询
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }

    // 继续之前的弹幕
    danmakuSet.forEach(danmaku => {
      danmaku.startMove()
    })

    // 轮询每个未锁定的轨道，如果有弹幕则发送
    this.interval = setInterval(() => {
      // console.log("interval", this.cacheStack, Math.random());

      if (this.cacheStack.length) {
        const text = this.cacheStack.shift()
        if (text) {
          const track = this.tracks.find(track => !track.isLocked)
          if (track) {
            // console.log(track);

            track.send(text)
          }
        }
      }
    }, 300)
  }

  stopPlaying() {
    this.isPlaying = false
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    danmakuSet.forEach(danmaku => {
      danmaku.stopMove()
    })
  }

  send(text: string) {
    this.cacheStack.push(text)
  }

  pause() {
    danmakuSet.forEach(danmaku => {
      danmaku.stopMove()
    })
    this.isPlaying = false
  }

  startBodySegmentation() {
    this.videoProcess()
  }

  stopBodySegmentation() {
    console.log("停止")
    this.isProcessingVideo = false
  }

  async videoProcess() {
    if (!this.videoElement) {
      throw new Error("videoElement is null");
      return;
    }
    const WIDTH = this.videoElement.offsetWidth
    const HEIGHT = this.videoElement.offsetHeight
    // console.log(WIDTH,HEIGHT,this.container.offsetWidth,this.container.offsetHeight);

    // 创建离屏canvas处理视频帧
    const offscreenCanvas = new OffscreenCanvas(WIDTH, HEIGHT);

    const offscreenContext = offscreenCanvas.getContext('2d');

    let lastTime = 0;
    const targetFPS = 15;
    let intervalTime = 1000 / targetFPS; // 每帧的时间间隔（毫秒）

    // 加载BodyPix模型
    const segmentationModel = await bodyPix.load();

    const _this = this
    async function processFrame() {
      if (!offscreenContext) {
        throw new Error("offscreenContext is null");
        return;
      }
      if (!_this.videoElement) {
        throw new Error("videoElement is null");
        return;
      }

      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      if (deltaTime < intervalTime || !_this.isPlaying) {
        requestAnimationFrame(processFrame);
        return
      }
      lastTime = currentTime

      // 绘制当前视频帧到离屏canvas
      offscreenContext.drawImage(
        _this.videoElement,
        0, 0,
        WIDTH,
        HEIGHT
      );

      // 执行人物分割
      const segmentationResult = await segmentationModel.segmentPerson(offscreenCanvas, {
        segmentationThreshold: 0.7,
        internalResolution: 'high',
        maxDetections: 1
      });
      // 获取像素数据
      const frameData = offscreenContext.getImageData(
        0, 0,
        WIDTH,
        HEIGHT
      );

      toDataURLWorker.postMessage({
        frameData: frameData,
        segmentationResult: segmentationResult.data,
      }, [frameData.data.buffer, segmentationResult.data.buffer])
      toDataURLWorker.onmessage = function (e) {
        const base64 = e.data
        if (!base64) {
          // debugger
          intervalTime = 2000
          _this.container.style.webkitMaskBoxImage = 'none';
          return
        } else {
          intervalTime = 1000 / targetFPS; // 每帧的时间间隔（毫秒）
          _this.container.style.webkitMaskBoxImage = `url(${base64})`;
        }
      }

      requestAnimationFrame(processFrame);

    }
    // 启动帧处理循环
    processFrame();
  }

  #initVideoElement(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement
    this.videoElement.addEventListener('pause', () => {
      console.log('pause');
      this.stopPlaying()
    })

    this.videoElement.addEventListener('play', () => {
      console.log('play');
      this.startPlaying()
    })
  }

  #initTracks() {
    const trackCount = 15
    for (let i = 0; i < trackCount; i++) {
      const track = new Track({
        height: 32,
        width: this.container.clientWidth,
        index: i,
        container: this.container
      })
      this.tracks.push(track)
    }
  }
}