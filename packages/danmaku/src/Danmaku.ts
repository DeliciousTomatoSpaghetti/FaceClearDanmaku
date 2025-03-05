import { Track } from "./Track"
import { EventEmitter } from "./utils/EventEmitter"
import { danmakuSet } from "./DanmakuEngine"

type DanmakuPosition = {
  x: number
  y: number
}

type DanmakuRect = {
  width: number
  height: number
}
export class Danmaku {
  public element: HTMLElement | null = null
  public parentTrack: Track | null = null
  public animationID: number | null = null
  public position: DanmakuPosition | null = null
  public rect: DanmakuRect | null = null
  public speedPerFrame = getRandomWithinTenPercent(0.5)
  public currX = 0
  public isPaused = false
  private emitter = new EventEmitter()

  constructor(track: Track, text: string) {
    this.#initDanmaku(track, text)
    danmakuSet.add(this)
  }

  #initDanmaku(track: Track, text: string) {
    this.parentTrack = track
    this.position = {
      x: this.parentTrack.width,
      y: this.parentTrack.index * this.parentTrack.height
    }
    this.element = document.createElement('div')
    this.element.innerText = text
    this.element.style.color = '#fff'
    this.parentTrack.container.appendChild(this.element)

    this.rect = {
      width: this.element.clientWidth,
      height: this.element.clientHeight
    }
    this.element.style.position = 'absolute'
    this.element.style.left = `${this.position.x}px`
    this.element.style.top = `${this.position.y}px`
    this.element.style.pointerEvents = 'auto'
  }
  startMove() {
    this.isPaused = false
    const run = () => {
      this.animationID = requestAnimationFrame(() => {
        if (!this.element || !this.parentTrack || !this.rect) return
        this.element.style.transform = `translateX(${this.currX}px)`
        this.currX -= this.speedPerFrame
        // debugger
        if (this.currX < -this.rect.width - 30) {
          this.emitter.emit('completeShow')
        }
        if (this.currX < -this.parentTrack.width - this.rect.width - 50) {
          this.destroy()
          return
        }
        run()
      })
    }
    run()
  }

  stopMove() {
    if (this.animationID) {
      cancelAnimationFrame(this.animationID)
      this.animationID = null
      this.isPaused = true
    }
  }

  destroy() {
    this.emitter.emit('beforeDestroy')
    this.stopMove()
    this.element?.remove()
    danmakuSet.delete(this)
  }

  onStartShow(fn: () => any) {
    this.emitter.once('startShow', fn)
  }
  onCompleteShow(fn: () => any) {
    this.emitter.once('completeShow', fn)
  }

  beforeDestroy(fn: () => any) {
    this.emitter.on('beforeDestroy', fn)
  }
}


function getRandomWithinTenPercent(num: number) {
  // 计算 10% 的范围
  const tenPercent = num * 0.1;
  // 生成一个在 -10% 到 10% 之间的随机偏移量
  const randomOffset = Math.random() * (2 * tenPercent) - tenPercent;
  // 计算最终的随机数
  return num + randomOffset;
}