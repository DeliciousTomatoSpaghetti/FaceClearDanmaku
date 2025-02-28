import { Danmaku } from "./Danmaku"

export type TrackOptions = {
  height: number
  width: number
  index: number
}

export class Track {
  public height: number
  public width: number
  public index: number
  public isLocked: boolean = false

  constructor(trackOptions: TrackOptions) {
    this.height = trackOptions.height
    this.width = trackOptions.width
    this.index = trackOptions.index
  }

  send(text: string) {
    this.isLocked = true
    const danmaku = new Danmaku(this, text)
    danmaku.startMove()
  }
}