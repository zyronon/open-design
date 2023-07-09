import CanvasUtil2 from "../engine/CanvasUtil2"
import {BaseConfig, Rect} from "../config/BaseConfig"
import helper from "../utils/helper"
import {Colors, defaultConfig} from "../utils/constant"
import draw from "../utils/draw"
import {ParentShape} from "./core/ParentShape";
import {BaseEvent2, EditType, LinePath, LineShape, LineType, P, ShapeStatus} from "../types/type"
import {BaseShape} from "./core/BaseShape"
import {PenConfig, PenNetworkLine} from "../config/PenConfig"
import {Math2} from "../utils/math"
import {eq} from "lodash"

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
      fillColor, lineWidth, borderColor, center
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

    ctx.strokeStyle = 'white'
    fillPathList.map(({close, path}) => {
      // ctx.fill(path,'evenodd')
      ctx.stroke(path)
    })

    //绘制所有点
    this._conf.penNetwork.nodes.map(point => {
      draw.drawRound(ctx, point)
    })

    draw.drawRound(ctx, {x: 0, y: 0})
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

    //绘制所有点
    nodes.map(point => {
      // if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
      // if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      draw.drawRound(ctx, point)
    })

    let {pointIndex, type} = this.editStartPointInfo
    //再绘制选中的当前点和控制点，之所以分开绘制，是因为遮盖问题
    if (type === EditType.Point || type === EditType.ControlPoint) {
      let currentPoint = nodes[pointIndex]
      let points = paths.filter(p => p.slice(0, 2).includes(pointIndex)).reduce((p: number[], c: PenNetworkLine) => {
        if (!p.includes(c[0])) p.push(c[0])
        if (!p.includes(c[1])) p.push(c[1])
        return p
      }, []).map(v => nodes[v])

      points.map(point => {
        point.cps.map(v => {
          if (v !== -1) draw.controlPoint(ctx, ctrlNodes[v], point)
        })
        if (eq(point, currentPoint)) {
          draw.currentPoint(ctx, point)
        } else {
          draw.drawRound(ctx, point)
        }
      })

      // draw.currentPoint(ctx, point)
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

  getCustomShapePath3(): { strokePathList: LinePath[], fillPathList: LinePath[] } {
    let strokePathList: LinePath[] = []
    let fillPathList: LinePath[] = []
    const {nodes, paths, ctrlNodes} = this._conf.penNetwork

    let ps = []
    for (let i = 0; i < paths.length - 1; i++) {
      for (let j = i; j < paths.length; j++) {
        let currentLine = paths[i]
        let nextLine = paths[j]
        let t = Math2.isIntersection2(currentLine, nextLine, nodes, ctrlNodes)
        if (t) {
          console.log('t', t)
          ps.push({
            p: t.intersectsPoint,
            is: [i, j]
          })
        }
      }
    }

    console.log('ps', JSON.stringify(ps, null, 2))
    let cu = CanvasUtil2.getInstance()
    let {ctx} = cu
    ctx.save()
    ctx.strokeStyle = 'red'
    ctx.fillStyle = 'red'

    const test = (lineIndex: number, list: any[]) => {
      let rIndex = list.findIndex(v => {
        return v.is.includes(lineIndex)
      })
      if (rIndex !== -1) {
        let item = list[rIndex]
        ctx.lineTo2(item.p)
        console.log('uite.p', item.p)
        list.splice(rIndex, 1)
        let i = 0
        if (item.is[0] === lineIndex) {
          i = 1
        }
        test(item.is[i], list)
      }
    }

    ctx.moveTo2(ps[0].p)
    // ps.shift()
    test(ps[0].is[0], ps)

    ctx.stroke()
    ctx.fill()
    ctx.restore()
    // for (let i = 0; i < paths.length - 1; i++) {
    for (let i = 0; i < 0; i++) {
      let ip, a = 0, b = 0
      for (let j = i + 1; j < paths.length; j++) {
        let currentLine = paths[i]
        let nextLine = paths[j]
        let t = Math2.isIntersection2(currentLine, nextLine, nodes, ctrlNodes)
        // let lastPoint = (j === path.length - 1 ? nodes[path[j][1]] : nodes[path[j + 1][0]])
        // let t = Math2.isIntersection(nodes[path[i][0]], nodes[path[i + 1][0]], nodes[path[j][0]], lastPoint)
        if (t) {
          ip = t
          a = i
          b = j
        }
      }
      if (ip) {
        console.log('ip', ip, a, b)
        let fillPath = new Path2D()
        fillPath.moveTo2(ip.intersectsPoint);

        if (ip.startLine.type === LineType.Line) {
          // @ts-ignore
          fillPath.lineTo2(...ip.startLine.lines[0].slice(1));
        }
        if (ip.startLine.type === LineType.Bezier2) {
          // @ts-ignore
          fillPath.quadraticCurveTo2(...ip.startLine.lines[0].slice(1))
        }
        if (ip.startLine.type === LineType.Bezier3) {
          // @ts-ignore
          fillPath.bezierCurveTo2(...ip.startLine.lines[0].slice(1))
        }
        for (let t = a + 1; t <= b; t++) {
          let line = paths[t]
          let lineType = line[6]
          let startPoint = nodes[line[0]]
          let endPoint = nodes[line[1]]
          // console.log('t', t, lineType)
          if (t === b) {
            if (ip.endLine.type === LineType.Line) {
              // @ts-ignore
              fillPath.lineTo2(...ip.endLine.lines[0].slice(1));
            }
            if (ip.endLine.type === LineType.Bezier2) {
              fillPath.quadraticCurveTo2(ip.endLine.lines[0][1], ip.endLine.lines[0][2])
            }
            if (ip.endLine.type === LineType.Bezier3) {
              // @ts-ignore
              fillPath.bezierCurveTo2(...ip.endLine.lines[0].slice(1))
            }
            break
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

    paths.map(line => {
      let strokePath = new Path2D()
      let lineType = line[6]
      let startPoint = nodes[line[0]]
      let endPoint = nodes[line[1]]
      strokePath.moveTo2(startPoint)
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
      strokePathList.push({close: true, path: strokePath})
    })
    return {strokePathList, fillPathList}
  }
}