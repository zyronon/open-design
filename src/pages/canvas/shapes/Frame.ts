import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, P, ShapeProps, ShapeType} from "../utils/type"
import {drawSelectedHover} from "./Ellipse/draw"
import {BaseConfig} from "../config/BaseConfig"
import draw from "../utils/draw"
import {getRotatedPoint} from "../../../utils"

export class Frame extends BaseShape {

  constructor(props: ShapeProps) {
    super(props)
    let cu = CanvasUtil2.getInstance()
    cu.ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
    let m = cu.ctx.measureText(this.conf.name)
    this.conf.nameWidth = m.width
  }

  /** @desc 只能在名字那里hover
   * */
  isOnlyHoverInName(): boolean {
    //如果有父级，都可以hover
    if (this.parent) {
      return false
    } else {
      //反之，则必须没有孩子时才能hover
      return !!this.children.length
    }
  }

  isInOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  isInName(mousePoint: P, isReverse = false) {
    let {x, y} = mousePoint
    const {original, nameWidth, flipHorizontal, flipVertical} = this.conf
    if (isReverse) {
      const {realRotation, center} = this.conf
      if (realRotation) {
        //注释同shapeIsIn
        let s2 = getRotatedPoint({x, y}, center, -realRotation)
        x = s2.x
        y = s2.y
      }
    }
    if (flipHorizontal && flipVertical) {
      return original.x > x && x > original.x - nameWidth
        && original.y < y && y < original.y + 18
    }
    if (flipHorizontal) {
      return original.x > x && x > original.x - nameWidth
        && original.y > y && y > original.y - 18
    }
    if (flipVertical) {
      return original.x < x && x < original.x + nameWidth
        && original.y < y && y < original.y + 18
    }
    return original.x < x && x < original.x + nameWidth
      && original.y > y && y > original.y - 18
  }

  isHoverIn(mousePoint: P, cu: CanvasUtil2): boolean {
    if (this.isOnlyHoverInName()) {
      return this.isInName(mousePoint) || super.isInBox(mousePoint)
    }
    return super.isInBox(mousePoint)
  }

  childDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    console.log('childDbClick')
    for (let i = 0; i < this.children.length; i++) {
      let shape = this.children[i]
      let isBreak = shape.event(event, parents?.concat([this]), true)
      if (isBreak) break
    }
    return true
  }

  childMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    if (this.isSelect) return false

    if (this.isOnlyHoverInName()) {
      return !this.isInName(event.point, true)
    }
    return false
  }

  childMouseMove(event: BaseEvent2, parents: BaseShape[]) {
    if (this.isSelect) return false
    if (this.isOnlyHoverInName()) {
      return !this.isInName(event.point, true)
    }
    return false
  }

  childMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  beforeShapeIsIn() {
    return false
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig) {
    let {
      layout: {w, h},
      radius,
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
      if (!parent) {
        ctx.clip()
      }
    }
  }

  renderHover(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): void {
  }

  renderSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): void {
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
    // drawSelectedHover(ctx, conf)
  }

  renderEdit(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig): void {
  }
}