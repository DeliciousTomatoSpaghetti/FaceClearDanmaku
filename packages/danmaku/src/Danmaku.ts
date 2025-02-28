import { Track } from "./Track"

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
  public speedPerFrame = 0.5

  constructor(track: Track, text: string) {
    this.#initDanmaku(track, text)
  }

  #initDanmaku(track: Track, text: string) {
    this.parentTrack = track
    this.position = {
      x: this.parentTrack.width,
      y: this.parentTrack.index * this.parentTrack.height
    }
    this.element = document.createElement('div')
    this.element.innerText = text
    this.parentTrack.container.appendChild(this.element)

    this.rect = {
      width: this.element.clientWidth,
      height: this.element.clientHeight
    }
    this.element.style.position = 'absolute'
    this.element.style.left = `${this.position.x}px`
    this.element.style.top = `${this.position.y}px`
  }
  startMove() {
    let startX = 0
    const run = () => {
      this.animationID = requestAnimationFrame(() => {
        if (!this.element || !this.parentTrack || !this.rect) return
        this.element.style.transform = `translateX(${startX}px)`
        startX -= this.speedPerFrame
        // debugger
        if (startX < -this.parentTrack.width - this.rect.width - 50) {
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
    }
  }

  destroy() {
    this.stopMove()
    this.element?.remove()
  }
}