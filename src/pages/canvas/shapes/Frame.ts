import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, P, ShapeProps, ShapeStatus, StrokeAlign} from "../utils/type"
import {BaseConfig} from "../config/BaseConfig"
import draw from "../utils/draw"
import {getRotatedPoint} from "../../../utils"
import {defaultConfig} from "../utils/constant"

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
      this.children[i].event(event, parents?.concat([this]), true)
      if (event.capture) break
    }
    return true
  }

  childMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
    if (this.status === ShapeStatus.Select) return false
    if (this.isOnlyHoverInName()) {
      if (this.isInName(event.point, true)) {
        return false
      }
      if (super.isInBox(event.point,)) {
        event.cancelStopPropagation()
      }
      return true
    }
    return false
  }

  childMouseMove(event: BaseEvent2, parents: BaseShape[]) {
    if (this.status === ShapeStatus.Select) return false
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

  drawShape(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig) {
    let {
      layout: {w, h},
      radius,
      fillColor, borderColor, rotation, lineWidth,
      type, flipVertical, flipHorizontal, children,
      name, clip, strokeAlign
    } = this.conf
    const {x, y} = p

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth
    let lineWidth2 = ctx.lineWidth / 2
    ctx.fillStyle = fillColor
    ctx.strokeStyle = borderColor
    if (radius) {
      draw.roundRect(ctx, {x, y, w, h}, radius)
    } else {
      ctx.beginPath()
      ctx.rect(x, y, w, h)
      ctx.closePath()
      ctx.fill()
      let path = new Path2D()
      if (strokeAlign === StrokeAlign.INSIDE) {
        path.rect(x + lineWidth2, y + lineWidth2, w - lineWidth2 * 2, h - lineWidth2 * 2)
      } else if (strokeAlign === StrokeAlign.OUTSIDE) {
        path.rect(x - lineWidth2, y - lineWidth2, w + lineWidth2 * 2, h + lineWidth2 * 2)
      } else {
        path.rect(x, y, w, h)
      }
      ctx.stroke(path)
    }

    let cu = CanvasUtil2.getInstance()
    ctx.font = `400 ${18 / cu.handScale}rem "SourceHanSansCN", sans-serif`
    let text = `${w.toFixed(2)} x ${h.toFixed(2)}`
    let m = ctx.measureText(text)
    let lX = x + w / 2 - m.width / 2
    ctx.textBaseline = 'top'
    ctx.fillText(text, lX, y + h + 5)
    ctx.textBaseline = 'bottom'
    ctx.fillText(name, x, y)

    if (clip) {
      //需要路径。上面不能用fillRect()和strokeRect()
      ctx.clip()
    }
  }

  drawHover(ctx: CanvasRenderingContext2D, conf: BaseConfig): void {
    draw.hover(ctx, conf)
  }

  drawSelected(ctx: CanvasRenderingContext2D, conf: BaseConfig): void {
    draw.selected(ctx, conf)
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, conf: BaseConfig): void {
    // drawSelectedHover(ctx, conf)
  }

  drawEdit(ctx: CanvasRenderingContext2D, conf: BaseConfig): void {
  }
}