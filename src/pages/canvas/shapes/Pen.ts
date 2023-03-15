import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, BezierPoint, BezierPointType, LineType, P, P2, ShapeStatus} from "../utils/type"
import {BaseConfig, Rect} from "../config/BaseConfig"
import helper from "../utils/helper"
import {cloneDeep} from "lodash"
import {defaultConfig} from "../utils/constant"

export class Pen extends BaseShape {

  get _config(): BaseConfig {
    return this.conf
  }

  set _config(val) {
    this.conf = val
  }

  beforeEvent(event: BaseEvent2): boolean {
    return false
  }

  beforeIsInShape(): boolean {
    return false
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
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

    //填充图形
    ctx.fillStyle = fillColor
    let path = this.getCustomShapePath()
    ctx.stroke(path)
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
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  getCustomShapePath(): Path2D {
    let path = new Path2D()
    this._config.lineShapes.map((line) => {
      line.map((currentPoint: BezierPoint, index: number, array: any) => {
        let previousPoint: BezierPoint
        if (index === 0) {
          previousPoint = cloneDeep(array[array.length - 1])
        } else {
          previousPoint = cloneDeep(array[index - 1])
        }
        let lineType: LineType = LineType.Line
        if (
          currentPoint.type === BezierPointType.RightAngle &&
          previousPoint.type === BezierPointType.RightAngle
        ) {
          lineType = LineType.Line
        } else if (
          currentPoint.type !== BezierPointType.RightAngle &&
          previousPoint.type !== BezierPointType.RightAngle) {
          lineType = LineType.Bezier3
        } else {
          if (previousPoint.cp2.use || currentPoint.cp1.use) {
            lineType = LineType.Bezier2
          } else {
            lineType = LineType.Line
          }
        }


        // let fixPreviousPoint = cloneDeep(previousPoint)
        // fixPreviousPoint.center.x = fixPreviousPoint.center.x - center.x
        // fixPreviousPoint.center.y = fixPreviousPoint.center.y - center.y
        // let  fixPreviousPoint.center = this.getPointRelativeToCenter(previousPoint.center, center)
        // console.log('lineType', fixPreviousPoint.center, fixCurrentPoint.center)
        switch (lineType) {
          case LineType.Line:
            // ctx.beginPath()
            // let s = this.getPointRelativeToCenter(currentPoint.center, center)
            // console.log('s', s)
            path.lineTo2(currentPoint.center)
            // path.lineTo2(this.getPointRelativeToCenter(currentPoint.center, center))
            // ctx.stroke()
            break
          case LineType.Bezier3:
            // ctx.beginPath()
            path.lineTo2(previousPoint.center)
            path.bezierCurveTo2(
              previousPoint.cp2,
              currentPoint.cp1,
              currentPoint.center)
            // ctx.stroke()
            break
          case LineType.Bezier2:
            let cp: P2
            if (previousPoint.cp2.use) cp = previousPoint.cp2
            if (currentPoint.cp1.use) cp = currentPoint.cp2
            // ctx.beginPath()
            path.lineTo2(previousPoint.center)
            path.quadraticCurveTo2(cp!, currentPoint.center)
            // ctx.stroke()
            break
        }
      })
    })

    path.closePath()
    return path
  }

}