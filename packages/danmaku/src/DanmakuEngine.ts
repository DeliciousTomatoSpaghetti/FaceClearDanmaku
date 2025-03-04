import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs-backend-webgl';

import { Track } from "./Track"
import { Danmaku } from "./Danmaku"

// import {maskImage} from "../public/maskimage1.jpg"

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

  constructor(parentContainer: HTMLElement, videoElement: HTMLVideoElement, options: DanmakuEngineOptions) {

    this.#initVideoElement(videoElement)

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

  async videoProcess() {
    if (!this.videoElement) return
    try {

      // 创建离屏canvas处理视频帧
      const offscreenCanvas = document.createElement('canvas');
      const offscreenContext = offscreenCanvas.getContext('2d', { willReadFrequently: true });

      offscreenCanvas.width = this.videoElement.videoWidth;
      offscreenCanvas.height = this.videoElement.videoHeight;

      // 加载BodyPix模型
      const segmentationModel = await bodyPix.load();

      const _this = this
      // 帧处理函数
      async function processFrame() {
        try {
          if (!offscreenContext) {
            throw new Error('Offscreen canvas context unavailable');
            return
          }
          if (!_this.videoElement) {
            throw new Error("videoElement is null");

          }
          // 绘制当前视频帧到离屏canvas
          offscreenContext.drawImage(
            _this.videoElement,
            0, 0,
            _this.videoElement.videoWidth,
            _this.videoElement.videoHeight
          );

          // 执行人物分割
          const segmentationResult = await segmentationModel.segmentPerson(offscreenCanvas, {
            segmentationThreshold: 0.7,
            internalResolution: 'medium',
            maxDetections: 1
          });
          // 获取像素数据
          const frameData = offscreenContext.getImageData(
            0, 0,
            _this.videoElement.videoWidth,
            _this.videoElement.videoHeight
          );

          // 应用分割蒙版
          for (let i = 0; i < segmentationResult.data.length; i++) {
            if (segmentationResult.data[i] === 0) { // 背景像素
              frameData.data[i * 4 + 3] = 255; // 设置完全透明
            } else { // 人物像素
              frameData.data[i * 4] = 0;     // R 设置为 0
              frameData.data[i * 4 + 1] = 0; // G 设置为 0
              frameData.data[i * 4 + 2] = 0; // B 设置为 0
              frameData.data[i * 4 + 3] = 0; // 保持不透明
            }
          }

          // 绘制到主canvas
          offscreenContext.putImageData(frameData, 0, 0);
          const base64 = offscreenCanvas.toDataURL()
          // console.log(base64);
          // _this.container.style.backgroundImage=`url(${base64})`
          _this.container.style.maskImage = `url(${base64})`
          _this.container.style.webkitMaskBoxImage = `url(${base64})`
          // canvasContext.putImageData(frameData, 0, 0);
          requestAnimationFrame(processFrame);
        } catch (frameError) {
          console.error('Frame processing error:', frameError);
        }
      }

      // 启动帧处理循环
      processFrame();
    } catch (modelError) {
      console.error('Model initialization failed:', modelError);
    }
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
    const trackCount = 5
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