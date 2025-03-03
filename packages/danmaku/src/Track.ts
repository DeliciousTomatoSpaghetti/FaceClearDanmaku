import { Danmaku } from "./Danmaku"
import { danmakuSet } from "./DanmakuEngine"

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
  public trackDanmakuSet: Set<Danmaku> = new Set()
  public lastDanmaku: Danmaku | null = null

  constructor(trackOptions: TrackOptions) {
    this.height = trackOptions.height
    this.width = trackOptions.width
    this.index = trackOptions.index
    this.container = trackOptions.container
  }

  send(text: string) {
    this.isLocked = true

    const danmaku = new Danmaku(this, text)
    if (this.lastDanmaku) {
      const leftTime = (this.width + this.lastDanmaku.currX + this.lastDanmaku.rect!.width) / this.lastDanmaku.speedPerFrame
      const newLeftTime = this.width / danmaku.speedPerFrame

      // 会发生碰撞
      if (leftTime > newLeftTime) {
        // const newSpeed = this.width * this.lastDanmaku.speedPerFrame / (this.width + this.lastDanmaku.currX)
        danmaku.speedPerFrame = this.lastDanmaku.speedPerFrame 
      }
      // const newSpeed=this.width/leftTime
    }
    this.lastDanmaku = danmaku
    this.trackDanmakuSet.add(danmaku)
    danmaku.startMove()
    danmaku.onCompleteShow(() => {
      this.isLocked = false
      console.log("解锁");
    }
    )

    danmaku.beforeDestroy(() => {
      this.trackDanmakuSet.delete(danmaku)
      console.log("删除");
    })
  }
}