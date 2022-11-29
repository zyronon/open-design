import {BaseShape} from "./BaseShape"
import {draw2, draw3, getPath, renderRoundRect} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, EventTypes, P} from "../type"
import {drawSelectedHover} from "./Ellipse/draw"
import {BaseConfig} from "../config/BaseConfig"

export class Frame extends BaseShape {

  childDbClick(event: BaseEvent2, p: BaseShape[]): boolean {
    let cu = CanvasUtil2.getInstance()
    console.log('childDbClick')
    for (let i = 0; i < this.children.length; i++) {
      let shape = this.children[i]
      let isBreak = shape.event(event, p?.concat([this]),true)
      if (isBreak) break
    }
    return true
  }

  childMouseDown(event: BaseEvent2, p: any[]) {
    return false
  }

  childMouseMove() {
    return false
  }

  childMouseUp() {
    return false
  }

  beforeShapeIsIn() {
    return false
  }

  isInOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  isHoverIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig) {
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
    } = this.config
    const {x, y} = p
    if (radius) {
      renderRoundRect({x, y, w, h}, radius, ctx)
    } else {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.lineTo(x, y)
      ctx.closePath()
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.strokeStyle = borderColor
      ctx.stroke()
    }
  }

  renderHover(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): void {
  }

  renderSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): void {
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
    drawSelectedHover(ctx, conf)
  }

  renderEdit(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig): void {
  }
}