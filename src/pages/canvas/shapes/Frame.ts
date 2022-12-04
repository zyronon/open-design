import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, P} from "../utils/type"
import {drawSelectedHover} from "./Ellipse/draw"
import {BaseConfig} from "../config/BaseConfig"
import draw from "../utils/draw"

export class Frame extends BaseShape {

  childDbClick(event: BaseEvent2, p: BaseShape[]): boolean {
    let cu = CanvasUtil2.getInstance()
    console.log('childDbClick')
    for (let i = 0; i < this.children.length; i++) {
      let shape = this.children[i]
      let isBreak = shape.event(event, p?.concat([this]), true)
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

  isHoverIn(mousePoint: P, cu: CanvasUtil2): boolean {
    const {x, y} = mousePoint
    let conf = this.conf
    if (this.isSelect){
      return super.isInBox(mousePoint)
    }else {
      let r = conf.original.x < x && x < conf.original.x + conf.nameWidth
        && conf.original.y > y && y > conf.original.y - 18
      // console.log('r', r, mousePoint, conf)
      return r
    }
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig) {
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      name
    } = this.conf
    const {x, y} = p
    if (radius) {
      draw.renderRoundRect({x, y, w, h}, radius, ctx)
    } else {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.lineTo(x, y)
      ctx.closePath()
      ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
      let text = `${w.toFixed(2)} x ${h.toFixed(2)}`
      let m = ctx.measureText(text)
      let lX = x + w / 2 - m.width / 2
      ctx.textBaseline = 'top'
      ctx.fillText(text, lX, y + h + 5)
      ctx.textBaseline = 'bottom'
      ctx.fillText(name, x, y)

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