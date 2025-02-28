import { Track } from "./Track"

export type DanmakuEngineOptions = {
  antiOcclusion?: boolean
}
export class DanmakuEngine {
  public container: HTMLElement
  public tracks: Track[] = []
  public cacheStack: string[] = []
  public isPlaying: boolean = false
  public interval: number | null = null
  constructor(container: HTMLElement, options: DanmakuEngineOptions) {
    this.container = container
    this.#initTracks()

  }

  startPlaying() {
    this.isPlaying = true
    this.interval = setInterval(() => {
      if (this.cacheStack.length) {
        const text = this.cacheStack.shift()
        if (text) {
          const track = this.tracks.find(track => !track.isLocked)
          if (track) {
            track.send(text)
          }
        }
      }
    }, 500)
  }

  stopPlaying() {
    this.isPlaying = false
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  send(text: string) {
    this.cacheStack.push(text)
  }

  #initTracks() {
    const trackCount = 5
    for (let i = 0; i < trackCount; i++) {
      const track = new Track({
        height: 32,
        width: this.container.clientWidth,
        index: i
      })
      this.tracks.push(track)
    }
  }
}