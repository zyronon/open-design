import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, getP2, P, ShapeEditStatus, ShapeStatus} from "../utils/type"
import {BaseConfig, Rect} from "../config/BaseConfig"
import helper from "../utils/helper"
import {Colors, defaultConfig} from "../utils/constant"
import draw from "../utils/draw"
import {merge} from "lodash"

export class Pen extends BaseShape {
  mouseDown: boolean = false


  get _config(): BaseConfig {
    return this.conf
  }

  set _config(val) {
    this.conf = val
  }

  beforeEvent(event: BaseEvent2): boolean {
    if (this.status === ShapeStatus.Edit) {
      event.stopPropagation()
      super.emit(event, [])
      return true
    }
    return false
  }

  beforeIsInShape(): boolean {
    return false
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, newLayout: Rect): void {
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): any {
    if (this.status === ShapeStatus.Edit) return
    let {
      radius,
      fillColor, borderColor, lineWidth, strokeAlign
    } = this.conf
    let {x, y, w, h} = newLayout

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth
    ctx.lineCap = "round"
    ctx.fillStyle = fillColor
    let path = super.getCustomShapePath(false)
    ctx.stroke(path)
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    // this.log('drawEdit')
    let {
      fillColor,
      center
    } = this.conf

    ctx.save()

    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor

    let path = super.getCustomShapePath(false)
    // ctx.fill(path)
    ctx.stroke(path)

    let bezierCps = this._config.lineShapes
    bezierCps.map(line => {
      line.map((currentPoint) => {
        draw.drawRound(ctx, currentPoint.center)
        if (currentPoint.cp1.use) draw.controlPoint(ctx, currentPoint.cp1, currentPoint.center)
        if (currentPoint.cp2.use) draw.controlPoint(ctx, currentPoint.cp2, currentPoint.center)
      })
    })
    ctx.restore()
  }


  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    return helper.isInBox(mousePoint, this.conf.box)
  }

  isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    console.log('pen-onMouseDown')
    if (this._editStatus === ShapeEditStatus.Edit) {
      this.mouseDown = true
      let lastLine = this._config.lineShapes[this._config.lineShapes.length - 1]
      if (lastLine) {
        let {center} = this._config
        let fixMousePoint = {
          x: event.point.x - center.x,
          y: event.point.y - center.y
        }
        lastLine.push(helper.getDefaultBezierPoint(fixMousePoint))
        CanvasUtil2.getInstance().render()
        return true
      }
    }
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('pen-onMouseMove')
    if (this._editStatus === ShapeEditStatus.Edit) {
      let lastLine = this._config.lineShapes[this._config.lineShapes.length - 1]
      if (lastLine) {
        let lastPoint = lastLine[lastLine.length - 1]
        if (lastPoint) {
          // console.log('pen-onMouseMove', lastPoint.center, event.point)
          let cu = CanvasUtil2.getInstance()
          let ctx = cu.ctx
          if (this.mouseDown) {
            lastPoint.cp2 = merge(getP2(), event.point)

          } else {
            cu.waitRenderOtherStatusFunc.push(() => {
              ctx.save()
              // draw.calcPosition(ctx, this.conf)
              ctx.strokeStyle = defaultConfig.strokeStyle
              ctx.beginPath()
              ctx.moveTo2(lastPoint.center)
              ctx.lineTo2(event.point)
              ctx.closePath()
              ctx.stroke()
              draw.drawRound(ctx, lastPoint.center)
              ctx.restore()
            })
            cu.render()
          }
          return true
        }
      }
    }
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    this.mouseDown = false
    return false
  }
}