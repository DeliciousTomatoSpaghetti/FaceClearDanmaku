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
  constructor(parentContainer: HTMLElement, options: DanmakuEngineOptions) {
    this.container = document.createElement('div')
    this.container.style.position = 'relative'
    this.container.style.height = '100%'
    this.container.style.width = '100%'
    this.container.style.display = 'flex'
    parentContainer.appendChild(this.container)
    this.container.style.backgroundColor = 'transparent'
    this.#initTracks()

  }

  startPlaying() {
    if (this.isPlaying) {
      return
    }
    this.isPlaying = true
    this.interval = setInterval(() => {
      console.log("interval", this.cacheStack, Math.random());

      if (this.cacheStack.length) {
        const text = this.cacheStack.shift()
        if (text) {
          const track = this.tracks.find(track => !track.isLocked)
          if (track) {
            console.log(track);

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
        index: i,
        container: this.container
      })
      this.tracks.push(track)
    }
  }
}