import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, P, ShapeType} from "../utils/type"
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

  childMouseDown(event: BaseEvent2, p: any[]): boolean {
    if (!this.canHover()) {
      const {x, y} = event.point
      let conf = this.conf
      let r = conf.original.x < x && x < conf.original.x + conf.nameWidth
        && conf.original.y > y && y > conf.original.y - 18
      // console.log('r', r, mousePoint, conf)
      return r
    }
    return false
  }

  childMouseMove() {
    return !this.canHover()
  }

  childMouseUp(): boolean {
    return false
  }

  beforeShapeIsIn() {
    return false
  }

  isInOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  canHover(): boolean {
    //如果有父级，都可以hover
    if (this.parent) {
      return true
    } else {
      //反之，则必须没有孩子时才能hover
      return !this.children.length
    }
  }

  isHoverIn(mousePoint: P, cu: CanvasUtil2): boolean {
    return super.isInBox(mousePoint)
    const {x, y} = mousePoint
    let conf = this.conf
    if (this.canHover() || this.isSelect) {
      return super.isInBox(mousePoint)
    }
    let r = conf.original.x < x && x < conf.original.x + conf.nameWidth
      && conf.original.y > y && y > conf.original.y - 18
    // console.log('r', r, mousePoint, conf)
    return r
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig) {
    let {
      w, h, radius,
      fillColor, borderColor, rotation, lineWidth,
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