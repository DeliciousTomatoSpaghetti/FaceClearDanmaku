import { Track } from "./Track"

export class Danmaku {
  public element: HTMLElement
  public parentTrack: Track
  public animationID: number | null = null
  constructor(track: Track, text: string) {
    this.parentTrack = track
    this.element = document.createElement('div')
    this.element.style.position = 'absolute'
    this.element.style.left = `${this.parentTrack.width}px`
    this.element.style.top = `${this.parentTrack.index * this.parentTrack.height}px`
    this.element.innerText = text
    this.parentTrack.container.appendChild(this.element)
  }

  startMove() {
    let p = 0
    const run = () => {
      this.animationID = requestAnimationFrame(() => {
        this.element.style.transform = `translateX(${p}px)`
        p = p - 0.5
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
}