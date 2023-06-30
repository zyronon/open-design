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
import {Math2} from "../utils/math"

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
      // ctx.fill(path,'evenodd')
      ctx.fill(path, 'nonzero')
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
    fillPathList.map(({close, path}) => {
      // ctx.fill(path, 'evenodd')
      ctx.fill(path)
    })
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })

    //渲染hover在线上时，线段的中心点
    if ((this.editHover.type === EditType.Line
        || this.editHover.type === EditType.CenterPoint)
      && this.editHover.lineIndex !== -1
    ) {
      draw.drawRound(ctx, this.hoverLineCenterPoint)
    }
    const {nodes, paths, ctrlNodes} = this._conf.penNetwork

    let {pathIndex, lineIndex, pointIndex, type} = this.editStartPointInfo
    let path = paths[pathIndex]

    //先绘制控制附近两个点的控制点与线条，好被后续的圆点遮盖
    if (lineIndex !== -1 && type !== EditType.Line) {
      let line = path[lineIndex]
      let point2 = nodes[line[1]]
      if (point2.cps[0] !== -1) draw.controlPoint(ctx, ctrlNodes[point2.cps[0]], point2)
      if (point2.cps[1] !== -1) draw.controlPoint(ctx, ctrlNodes[point2.cps[1]], point2)

      if (lineIndex === 0) {
        line = path[path.length - 1]
      } else {
        line = path[lineIndex - 1]
      }
      let point3 = nodes[line[0]]
      if (point3.cps[0] !== -1) draw.controlPoint(ctx, ctrlNodes[point3.cps[0]], point3)
      if (point3.cps[1] !== -1) draw.controlPoint(ctx, ctrlNodes[point3.cps[1]], point3)
    }

    //绘制所有点
    paths.map((path) => {
      path.map(line => {
        // if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
        // if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
        draw.drawRound(ctx, nodes[line[0]])
        //TODO 这个只需要最后一条线时才绘制吧？
        draw.drawRound(ctx, nodes[line[1]])
      })
    })

    //再绘制选中的当前点和控制点，之所以分开绘制，是因为遮盖问题
    if (lineIndex !== -1 && type !== EditType.Line) {
      let point = nodes[path[lineIndex][pointIndex ?? 0]]
      if (point.cps[0] !== -1) draw.controlPoint(ctx, ctrlNodes[point.cps[0]], point)
      if (point.cps[1] !== -1) draw.controlPoint(ctx, ctrlNodes[point.cps[1]], point)
      draw.currentPoint(ctx, point)
    }

    if (this.tempPoint) {
      draw.currentPoint(ctx, this.tempPoint)
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

    let path = paths[0]
    for (let i = 0; i < path.length - 2; i++) {
      for (let j = i + 2; j < path.length; j++) {
        let lastPoint = (j === path.length - 1 ? nodes[path[j][1]] : nodes[path[j + 1][0]])
        let ip = Math2.isIntersection(nodes[path[i][0]], nodes[path[i + 1][0]], nodes[path[j][0]], lastPoint)
        if (ip) {
          console.log(ip, i, j)
          let fillPath = new Path2D()
          fillPath.moveTo2(ip);
          for (let t = i + 1; t < j; t++) {
            let line = path[t]

            let lineType = helper.judgeLineType2(line)
            let startPoint = nodes[line[0]]
            let endPoint = nodes[line[1]]
            if (t === i + 1) {
              fillPath.lineTo2(startPoint);
            }
            switch (lineType) {
              case LineType.Line:
                fillPath.lineTo2(endPoint)
                break
              case LineType.Bezier3:
                fillPath.bezierCurveTo2(ctrlNodes[line[2]], ctrlNodes[line[3]], endPoint)
                break
              case LineType.Bezier2:
                let cp: number = 0
                if (line[2] !== -1) cp = line[2]
                if (line[3] !== -1) cp = line[3]
                fillPath.quadraticCurveTo2(ctrlNodes[cp], endPoint)
                break
            }

          }

          fillPathList.push({close: true, path: fillPath})
        }
      }
    }

    paths.map(path => {
      if (path.length) {
        let strokePath = new Path2D()
        strokePath.moveTo2(nodes[path[0][0]])
        path.map(line => {
          let lineType = helper.judgeLineType2(line)
          let startPoint = nodes[line[0]]
          let endPoint = nodes[line[1]]
          switch (lineType) {
            case LineType.Line:
              strokePath.lineTo2(endPoint)
              break
            case LineType.Bezier3:
              strokePath.bezierCurveTo2(ctrlNodes[line[2]], ctrlNodes[line[3]], endPoint)
              break
            case LineType.Bezier2:
              let cp: number = 0
              if (line[2] !== -1) cp = line[2]
              if (line[3] !== -1) cp = line[3]
              strokePath.quadraticCurveTo2(ctrlNodes[cp], endPoint)
              break
          }
        })
        strokePathList.push({close: true, path: strokePath})
      }
    })
    return {strokePathList, fillPathList}
  }
}