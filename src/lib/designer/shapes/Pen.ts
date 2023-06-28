import CanvasUtil2 from "../engine/CanvasUtil2"
import {BaseConfig, Rect} from "../config/BaseConfig"
import helper from "../utils/helper"
import {Colors, defaultConfig} from "../utils/constant"
import draw from "../utils/draw"
import {ParentShape} from "./core/ParentShape";
import {
  BaseEvent2,
  BezierPoint, EditType,
  LinePath,
  LineShape,
  LineType,
  P, P2,
  PointInfo,
  ShapeStatus,
  ShapeType
} from "../types/type"
import {BaseShape} from "./core/BaseShape"
import {PenConfig} from "../config/PenConfig"
import {Bezier} from "../utils/bezier"

export class Pen extends ParentShape {
  mouseDown: boolean = false

  get _conf(): PenConfig {
    return this.conf as any
  }

  set _conf(val) {
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

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): any {
    if (this.status === ShapeStatus.Edit) return
    let {
      fillColor, lineWidth, borderColor
    } = this.conf

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth
    ctx.lineCap = "round"
    ctx.strokeStyle = borderColor
    ctx.fillStyle = fillColor
    let {strokePathList, fillPathList} = this.getCustomShapePath3()

    fillPathList.map(({close, path}) => {
      ctx.fill(path)
    })
    strokePathList.map(line => {
      ctx.stroke(line.path)
    })
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let {strokePathList, fillPathList} = this.getCustomShapePath3()
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let {strokePathList, fillPathList} = this.getCustomShapePath3()
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })
    draw.selected(ctx, newLayout)
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    // this.log('drawEdit',)
    ctx.save()
    let {
      fillColor
    } = this.conf

    ctx.save()
    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor

    let {strokePathList, fillPathList} = this.getCustomShapePath3()
    // fillPathList.map(({close, path}) => {
    //   ctx.fill(path)
    // })
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })

    //渲染hover在线上时，线段的中心点
    if ((this.editHover.type === EditType.Line
        || this.editHover.type === EditType.CenterPoint)
      && this.editHover.pointIndex !== -1
    ) {
      draw.drawRound(ctx, this.hoverLineCenterPoint)
    }
    let {lineIndex, pointIndex, type} = this.editStartPointInfo
    // //先绘制控制线，好被后续的圆点遮盖
    // if (pointIndex !== -1 && type !== EditType.Line) {
    //   let line = lineShapes[lineIndex]
    //   let point
    //   if (pointIndex === 0) {
    //     if (line.close) {
    //       point = this.getPoint(line.points[line.points.length - 1])
    //       if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
    //       if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
    //     }
    //   } else {
    //     point = this.getPoint(line.points[pointIndex - 1])
    //     if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
    //     if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
    //   }
    //   if (pointIndex === line.points.length - 1) {
    //     if (line.close) {
    //       point = this.getPoint(line.points[0])
    //       if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
    //       if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
    //     }
    //   } else {
    //     point = this.getPoint(line.points[pointIndex + 1])
    //     if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
    //     if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
    //   }
    // }

    const {nodes, paths} = this._conf.penNetwork

    //绘制所有点
    nodes.map((node) => {
      // if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
      // if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      draw.drawRound(ctx, node)
    })
    //绘制选中的当前点和控制点
    if (pointIndex !== -1 && type !== EditType.Line) {
      let {point, start, end} = this.getControlPoint(lineIndex, pointIndex)
      if (start) draw.controlPoint(ctx, start, point)
      if (end) draw.controlPoint(ctx, end, point)
      draw.currentPoint(ctx, point)
    }
    ctx.restore()
  }

  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    return helper.isInBox(mousePoint, this.conf.box)
  }

  isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('pen-onDbClick')
    // let cu = CanvasUtil2.getInstance()
    // if (this.status === ShapeStatus.Edit) {
    //   this.status = ShapeStatus.Select
    //   cu.editShape = undefined
    //   cu.selectedShape = this
    //   cu.mode = ShapeType.SELECT
    // } else {
    //   this.status = ShapeStatus.Edit
    //   cu.editShape = this
    //   cu.mode = ShapeType.EDIT
    // }
    return false
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('pen-onMouseDown')
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('pen-onMouseMove')
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('pen-onMouseUp')
    this.mouseDown = false
    return false
  }

  getCustomPoint(): LineShape[] {
    return []
  }

  getCustomShapePath3(): {strokePathList: LinePath[], fillPathList: LinePath[]} {
    let strokePathList: LinePath[] = []
    let fillPathList: LinePath[] = []
    const {nodes, paths, ctrlNodes} = this._conf.penNetwork

    paths.map(path => {
      if (path.length) {
        let strokePath = new Path2D()
        let fillPath = new Path2D()
        strokePath.moveTo2(nodes[path[0][0]])
        fillPath.moveTo2(nodes[path[0][0]])
        path.map(line => {
          let lineType = helper.judgeLineType2(line)
          let endPoint = nodes[line[1]]
          switch (lineType) {
            case LineType.Line:
              strokePath.lineTo2(endPoint)
              fillPath.lineTo2(endPoint)
              break
            case LineType.Bezier3:
              strokePath.bezierCurveTo2(ctrlNodes[line[2]], ctrlNodes[line[3]], endPoint)
              fillPath.bezierCurveTo2(ctrlNodes[line[2]], ctrlNodes[line[3]], endPoint)
              break
            case LineType.Bezier2:
              let cp: number = 0
              if (line[2] !== -1) cp = line[2]
              if (line[3] !== -1) cp = line[3]
              strokePath.quadraticCurveTo2(ctrlNodes[cp], endPoint)
              fillPath.quadraticCurveTo2(ctrlNodes[cp], endPoint)
              break
          }
        })
        strokePathList.push({close: true, path: strokePath})
        fillPathList.push({close: true, path: fillPath})
      }
    })
    return {strokePathList, fillPathList}
  }
}