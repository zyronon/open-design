import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../engine/CanvasUtil2"
import {BaseEvent2, P, ShapeProps, ShapeStatus, ShapeType, StrokeAlign} from "../utils/type"
import {BaseConfig, Rect} from "../config/BaseConfig"
import draw from "../utils/draw"
import {getRotatedPoint, jiaodu2hudu} from "../../../utils"
import {Colors, defaultConfig} from "../utils/constant"
import helper from "../utils/helper"

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

  isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
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

  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    if (this.isOnlyHoverInName()) {
      // return this.isInName(mousePoint)
      return this.isInName(mousePoint) || helper.isInBox(mousePoint, this.conf.box)
    }
    return helper.isInBox(mousePoint, this.conf.box)
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('childDbClick')
    // for (let i = 0; i < this.children.length; i++) {
    //   this.children[i].event(event, parents?.concat([this]), true)
    //   if (event.capture) break
    // }
    return false
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
    if (this.status === ShapeStatus.Select) return false
    if (this.isOnlyHoverInName()) {
      if (this.isInName(event.point, true)) {
        return false
      }
      if (helper.isInBox(event.point, this.conf.box)) {
        event.cancelStopPropagation()
      }
      return true
    }
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]) {
    // return false
    if (this.status === ShapeStatus.Select) return false
    if (this.isOnlyHoverInName()) {
      return !this.isInName(event.point, true)
    }
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  beforeIsInShape() {
    return false
  }

  beforeEvent(event: BaseEvent2) {
    return false
  }

  //这里仅绘制图形线路,不管着色。用于绘制图形填充，或用于hover描边（边的宽度经过等比缩放）
  //绘制图形描边时的处理不一样。canvas默认绘制是在线条的中间，边的宽度也未等比缩放。
  //如果要把描边在内部或外部，需修改xywh值。单独处理
  // TODO 矩形的绘制方法也是这样，可以考虑优化代码
  getShapePath(ctx: CanvasRenderingContext2D, layout: Rect, r: number) {
    let {x, y, w, h} = layout
    let path = new Path2D()
    if (r > 0) {
      let w2 = w / 2, h2 = h / 2
      path.moveTo(x + w2, y)
      path.arcTo(x + w, y, x + w, y + h2, r)
      path.arcTo(x + w, y + h, x + w2, y + h, r)
      path.arcTo(x, y + h, x, y + h2, r)
      path.arcTo(x, y, x + w2, y, r)
    } else {
      path.rect(x, y, w, h)
    }
    path.closePath()
    return path
  }

  drawShape(ctx: CanvasRenderingContext2D, layout: Rect, parent?: BaseConfig) {
    let {
      radius,
      fillColor, borderColor, lineWidth,
      name, clip, strokeAlign
    } = this.conf
    let {x, y, w, h} = layout

    //文字
    ctx.fillStyle = defaultConfig.strokeStyle
    let cu = CanvasUtil2.getInstance()
    ctx.font = `400 ${16 / cu.handScale}rem "SourceHanSansCN", sans-serif`
    let text = `${w.toFixed(2)} x ${h.toFixed(2)}`
    let m = ctx.measureText(text)
    let lX = x + w / 2 - m.width / 2
    ctx.textBaseline = 'top'
    ctx.fillText(text, lX, y + h + 5)
    ctx.textBaseline = 'bottom'
    ctx.fillText(name, x, y)

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth

    //填充图形
    ctx.fillStyle = fillColor
    let path = this.getShapePath(ctx, layout, this.conf.radius)
    ctx.fill(path)

    //描边
    let lw2 = ctx.lineWidth / 2
    if (strokeAlign === StrokeAlign.INSIDE) {
      x += lw2, y += lw2, w -= lw2 * 2, h -= lw2 * 2, radius -= lw2
    } else if (strokeAlign === StrokeAlign.OUTSIDE) {
      x -= lw2, y -= lw2, w += lw2 * 2, h += lw2 * 2, radius += lw2
    }
    ctx.strokeStyle = borderColor
    let path2 = this.getShapePath(ctx, {x, y, w, h}, radius)
    ctx.stroke(path2)

    //裁剪放在描边后，不然描边也会被裁掉
    if (clip) ctx.clip(path)
  }

  drawHover(ctx: CanvasRenderingContext2D, layout: Rect): void {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let path = this.getShapePath(ctx, layout, 0)
    // let path = this.getShapePath(ctx, newLayout, this.conf.radius)
    ctx.stroke(path)
  }

  drawSelected(ctx: CanvasRenderingContext2D, layout: Rect): void {
    draw.selected(ctx, layout)
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, layout: Rect): void {
  }

  drawEdit(ctx: CanvasRenderingContext2D, conf: BaseConfig): void {
  }
}