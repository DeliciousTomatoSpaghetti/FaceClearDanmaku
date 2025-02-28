import { Danmaku } from "./Danmaku"

export type TrackOptions = {
  height: number
  width: number
  index: number
  container: HTMLElement
}

export class Track {
  public height: number
  public width: number
  public index: number
  public container: HTMLElement
  public isLocked: boolean = false

  constructor(trackOptions: TrackOptions) {
    this.height = trackOptions.height
    this.width = trackOptions.width
    this.index = trackOptions.index
    this.container = trackOptions.container
  }

  send(text: string) {
    this.isLocked = true
    const danmaku = new Danmaku(this, text)
    danmaku.startMove()
    danmaku.onCompleteShow(() => {
      this.isLocked = false
      console.log("解锁");
    }
    )
  }
}