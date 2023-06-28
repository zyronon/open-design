import {BaseShape} from "./core/BaseShape"
import {EllipseConfig} from "../config/EllipseConfig"
import {BaseConfig, Rect} from "../config/BaseConfig"
import draw from "../utils/draw"
import {
  BaseEvent2,
  BezierPointType,
  EditType,
  getP2,
  LinePath,
  LineShape,
  LineType,
  P,
  PointInfo,
  PointType,
  ShapeProps,
  ShapeStatus,
  StrokeAlign
} from "../types/type"
import {Math2} from "../utils/math"
import CanvasUtil2 from "../engine/CanvasUtil2"
import {v4 as uuid} from "uuid"
import {Bezier} from "../utils/bezier"
import helper from "../utils/helper"
import {ParentShape} from "./core/ParentShape";
import {Colors, defaultConfig} from "../utils/constant"
import {clone, cloneDeep} from "lodash"

//圆的鼠标hover类型
enum EllipseHoverType {
  End = 'End',//终点
  Start = 'Start',//起点
  InsideDiameter = 'InsideDiameter'//内径
}

export class Polygon extends ParentShape {
  ellipseHoverType?: EllipseHoverType
  ellipseEnterType?: EllipseHoverType
  cpMap = new Map()
  lastDt: number = 0

  constructor(props: ShapeProps) {
    super(props)
    this.init()
  }

  get _conf(): EllipseConfig {
    return this.conf as EllipseConfig
  }

  set _conf(val) {
    this.conf = val
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): void {
    if (this.status === ShapeStatus.Edit) return
    let {
      radius, lineShapes,
      fillColor, borderColor, lineWidth, strokeAlign
    } = this.conf
    let {x, y, w, h} = newLayout

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth

    //填充图形
    ctx.fillStyle = fillColor
    let pathList = this.getShapePath(newLayout, this.conf.radius)
    pathList.map(({close, path}) => {
      if (close) {
        ctx.fill(path)
      } else {
        ctx.stroke(path)
      }
    })

    //描边
    let lw2 = ctx.lineWidth / 2
    if (strokeAlign === StrokeAlign.INSIDE) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      x += lw2, y += lw2, w -= lw2 * 2, h -= lw2 * 2, radius -= lw2
    } else if (strokeAlign === StrokeAlign.OUTSIDE) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      x -= lw2, y -= lw2, w += lw2 * 2, h += lw2 * 2, radius += lw2
    }
    ctx.strokeStyle = borderColor
    pathList = this.getShapePath({x, y, w, h}, radius)
    pathList.map(line => {
      ctx.stroke(line.path)
    })

    lineShapes.map(line => {
      line.points.map((pointInfo) => {
        // let point = this.getPoint(pointInfo)
        // if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
        // if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
        // draw.drawRound(ctx, point.center)
      })
    })
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let pathList = this.getShapePath(newLayout, 0)
    pathList.map(linePath => {
      ctx.stroke(linePath.path)
    })
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    draw.selected(ctx, newLayout)
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, newLayout: Rect) {
    let {totalLength = 4} = this._conf
    ctx.strokeStyle = 'rgb(139,80,255)'
    let r2 = 4
    if (totalLength !== 4) {
      draw.drawRound(ctx, {x: 0, y: 0}, r2,)
      // console.log('this.ellipseEnterType',this.ellipseEnterType)
      if (this.ellipseEnterType !== EllipseHoverType.Start) {
        draw.drawRound(ctx, this._conf.startOperatePoint, r2,)
      }
      if (this.ellipseEnterType !== EllipseHoverType.End) {
        draw.drawRound(ctx, this._conf.endOperatePoint, r2,)
      }
      if (this.ellipseEnterType !== EllipseHoverType.InsideDiameter) {
        draw.drawRound(ctx, this._conf.innerCenterOperatePoint, r2,)
      }
    } else {
      if (this.ellipseEnterType !== EllipseHoverType.End) {
        draw.drawRound(ctx, this._conf.endOperatePoint, r2,)
      }
    }
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    // this.log('drawEdit')
    let {
      fillColor, lineShapes
    } = this.conf

    ctx.save()
    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor

    let pathList = super.getCustomShapePath()
    pathList.map(linePath => {
      linePath.close && ctx.fill(linePath.path)
      ctx.stroke(linePath.path)
    })


    if ((this.editHover.type === EditType.Line
        || this.editHover.type === EditType.CenterPoint)
      && this.editHover.lineIndex !== -1
    ) {
      draw.drawRound(ctx, this.hoverLineCenterPoint)
    }
    let {pathIndex, lineIndex, type} = this.editStartPointInfo
    //先绘制控制线，好被后续的圆点遮盖
    if (lineIndex !== -1 && type !== EditType.Line) {
      let line = lineShapes[pathIndex]
      let point
      if (lineIndex === 0) {
        if (line.close) {
          point = this.getPoint(line.points[line.points.length - 1])
          if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
          if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
        }
      } else {
        point = this.getPoint(line.points[lineIndex - 1])
        if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
        if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      }
      if (lineIndex === line.points.length - 1) {
        if (line.close) {
          point = this.getPoint(line.points[0])
          if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
          if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
        }
      } else {
        point = this.getPoint(line.points[lineIndex + 1])
        if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
        if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      }
    }
    lineShapes.map(line => {
      line.points.map((pointInfo) => {
        let point = this.getPoint(pointInfo)
        // if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
        // if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
        draw.drawRound(ctx, point.center)
      })
    })
    if (lineIndex !== -1 && type !== EditType.Line) {
      let line = lineShapes[pathIndex]
      let point = this.getPoint(line.points[lineIndex])
      if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
      if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      draw.currentPoint(ctx, point.center)
    }

    ctx.restore()
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    if (this.ellipseHoverType) {
      this.ellipseEnterType = this.ellipseHoverType
      this.ellipseHoverType = undefined
      return true
    }
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    let {x: cx, y: cy,} = event.point
    let cu = CanvasUtil2.getInstance()

    // const {layout: {x, y, w, h}, center} = this.conf
    // let lineIndex = -1
    // if (cx > center.x) {
    //   if (cy > center.y) lineIndex = 0
    //   else lineIndex = 3
    // } else {
    //   if (cy > center.y) lineIndex = 1
    //   else lineIndex = 2
    // }
    //
    // console.log('lineIndex', lineIndex)
    // let k = h / w
    // let newW2 = 0
    // let newH2 = k * newW2
    // let ox = 0.5522848 * newW2, oy = 0.5522848 * newH2
    // let right = {
    //   x: newW2,
    //   y: 0
    // }
    // let cp1 = {
    //   x: right.x,
    //   y: right.y + oy
    // }
    // let bottom = {
    //   x: 0,
    //   y: newH2
    // }
    // let cp2 = {
    //   x: bottom.x + ox,
    //   y: bottom.y
    // }
    // Bezier.getTByPoint_3()

    if (this.ellipseEnterType) {
      // if (true) {
      const {layout: {x, y, w, h}, center} = this.conf
      let lineIndex = -1
      if (cx > center.x) {
        if (cy > center.y) lineIndex = 0
        else lineIndex = 3
      } else {
        if (cy > center.y) lineIndex = 1
        else lineIndex = 2
      }
      let bs: any = this.getLineCps(lineIndex)

      let p0, p1, p2, p3, p = null
      p0 = bs[0]
      p1 = bs[1]
      p2 = bs[2]
      p3 = bs[3]

      let ch = cy - center.y
      let cw = cx - center.x

      let k = ch / cw

      //一元三次方程：ax^3+bx^2+cx+d=0
      // 三次函数公式：P = (1−t)3P0 + 3(1−t)2tP1 +3(1−t)t2P2 + t3P3
      //P = (1−t)3P0 + 3(1−t)2tP1 +3(1−t)t2P2 + t3P3
      //可以化简为ax^3+bx^2+cx+d=0
      // 下面4个值是由上面的公式化简为ax^3+bx^2+cx+d=0的结果
      // XA是ax^3的值，XB是bx^2的值
      let XA = p3.x - 3 * p2.x + 3 * p1.x - p0.x,
        XB = 3 * (p2.x - 2 * p1.x + p0.x),
        XC = 3 * (p1.x - p0.x),
        XD = p0.x
      let YA = p3.y - 3 * p2.y + 3 * p1.y - p0.y,
        YB = 3 * (p2.y - 2 * p1.y + p0.y),
        YC = 3 * (p1.y - p0.y),
        YD = p0.y
      let A = k * XA - YA
      let B = k * XB - YB
      let C = k * XC - YC
      let D = k * XD - YD

      let t: any[] = Math2.solveCubic(A, B, C, D)
      t = t.filter(v => 0 <= v && v <= 1.01)
      if (t.length) {
        // console.log('t', t[0])
        // console.log('lineIndex', lineIndex)
        let touchT = lineIndex + t[0] ?? 0.5
        let {totalLength, startT} = this._conf
        if (this.ellipseEnterType === EllipseHoverType.End) {
          let oldEndT = totalLength + startT
          // if (oldEndT === 4 || touchT === 4) {
          //   return true
          // }
          //如果oldEndT等4，会被于成0，所以只需大于4才于
          if (oldEndT > 4) {
            oldEndT = oldEndT % 4
          }
          let dt = touchT - oldEndT;
          //滑过右侧起点那条线时，touchT会突然从0.00xxx变成4。dt会变得特别大。所以dt大于3时，用上次的滑动值
          if (Math.abs(dt) > 3) {
            dt = this.lastDt
          }
          this._conf.totalLength += dt
          //TODO　这里会有问题。但是影响不大，能用
          //  totalLength: 2.9,
          //     startT: 3.5,
          if (this._conf.totalLength >= 4) {
            this._conf.totalLength = -4
          }
          console.log(
            'oldEndT', oldEndT,
            'touchT', touchT,
            'dt', dt,
            'totalLength', this._conf.totalLength
          )
          this.lastDt = dt
          // this._conf.totalLength = touchT - this._conf.startT
        }
        if (this.ellipseEnterType === EllipseHoverType.Start) {
          this._conf.startT = lineIndex + t[0] ?? 0.5
        }

        if (this.ellipseEnterType === EllipseHoverType.InsideDiameter) {
          let s = Bezier.getPointByT_3(t[0], bs)
          console.log('s', s)

          //当前方向的当前点与中心点长度
          let currentLineLength = Math2.getHypotenuse2(event.point, center)
          //当前方向边界与中心点的总长度
          let totalLineLength = w / 2
          if (w !== h) {
            totalLineLength = Math2.getHypotenuse2({
              x: s.x + center.x,
              y: s.y + center.y,
            }, center)
          }

          //长宽比
          let k2 = totalLineLength / currentLineLength
          // console.log(
          //   'currentLineLength', currentLineLength,
          //   'line2', totalLineLength,
          //   'k2', k2
          // )

          console.log('k2', k2)

          let innerLayout = {
            w: w / k2,
            h: h / k2,
            x: 0,
            y: 0
          }
          console.log('innerLayout', innerLayout)

        }
        this._conf.isComplete = false
        this.conf.lineShapes = this.getCustomPoint()
        cu.render()
      }
      draw.drawRound(cu.ctx, event.point)
      return true;
    }
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    this.ellipseEnterType = this.ellipseHoverType = undefined
    return false
  }

  onMouseDowned(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

  getShapePath(layout: Rect, r: number): LinePath[] {
    if (this.conf.isCustom || !this._conf.isComplete) {
      return super.getCustomShapePath()
    }
    let {x, y, w, h} = layout
    let outA = w / 2
    let outB = h / 2
    let x1, x2, y1, y2
    let path = new Path2D()
    console.log('-----------------')
    let ps: P[] = []
    for (let i = 0; i < 3; i++) {
      x1 = outA * Math.cos((30 + i * 120) / 180 * Math.PI)
      y1 = outB * Math.sin((30 + i * 120) / 180 * Math.PI)
      ps.push({x: x1, y: y1})
      // path.lineTo(x1, y1)
    }
    let start: P
    let ps2 = ps.reduce((previousValue: any[], currentValue, currentIndex, array) => {
      let center
      let data: any = {
        cp1: currentValue,
      }
      if (currentIndex === 0) {
        center = helper.getStraightLineCenterPoint(currentValue, array[array.length - 1])
        start = center
        // start =  array[array.length - 1]
      } else {
        center = helper.getStraightLineCenterPoint(currentValue, array[currentIndex - 1])
        // previousValue[previousValue.length - 1].cp2 = center
        previousValue[previousValue.length - 1].cp2 = currentValue
      }
      previousValue.push(data)
      return previousValue
    }, [])

    ps2[ps2.length - 1].cp2 = start!
    // ps2[ps2.length - 1].cp2 = ps[0]

    console.log('ps2',ps2)
    path.moveTo2(ps2[ps2.length - 1].cp2)
    ps2.map((p, i) => {
      path.arcTo(p.cp1.x, p.cp1.y, p.cp2.x, p.cp2.y, 30)
    })

    path.closePath()
    return [{close: true, path}]
  }

  beforeEvent(event: BaseEvent2): boolean {
    return false
  }

  beforeIsInShape(): boolean {
    if (this.ellipseEnterType) {
      return true
    }
    return false
  }

  getCustomPoint(): LineShape[] {
    let {
      totalLength = 4, startT = 0
    } = this._conf
    let {w, h} = this._conf.layout
    let w2 = w / 2, h2 = h / 2

    //http://www.alloyteam.com/2015/07/canvas-hua-tuo-yuan-di-fang-fa/
    //这里也可以用.5和.6来算ox和oy
    let ox = 0.5522848 * w2, oy = 0.5522848 * h2

    this.getOperatePoint()

    //是否是整圆
    let fullEllipse = totalLength === 4

    if (fullEllipse) {
      let points: PointInfo[] = []
      points.push({
        type: PointType.Single,
        point: {
          id: uuid(),
          cp1: {...getP2(true), ...this.cpMap.get('line4')[1]},
          center: {...getP2(true), ...this.cpMap.get('right')},
          cp2: {...getP2(true), ...this.cpMap.get('line1')[0]},
          type: BezierPointType.MirrorAngleAndLength
        }
      })
      points.push({
        type: PointType.Single,
        point: {
          id: uuid(),
          cp1: {...getP2(true), ...this.cpMap.get('line1')[1]},
          center: {...getP2(true), ...this.cpMap.get('bottom')},
          cp2: {...getP2(true), ...this.cpMap.get('line2')[0]},
          type: BezierPointType.MirrorAngleAndLength
        }
      })
      points.push({
        type: PointType.Single,
        point: {
          id: uuid(),
          cp1: {...getP2(true), ...this.cpMap.get('line2')[1]},
          center: {...getP2(true), ...this.cpMap.get('left')},
          cp2: {...getP2(true), ...this.cpMap.get('line3')[0]},
          type: BezierPointType.MirrorAngleAndLength
        }
      })
      points.push({
        type: PointType.Single,
        point: {
          id: uuid(),
          cp1: {...getP2(true), ...this.cpMap.get('line3')[1]},
          center: {...getP2(true), ...this.cpMap.get('top')},
          cp2: {...getP2(true), ...this.cpMap.get('line4')[0]},
          type: BezierPointType.MirrorAngleAndLength
        }
      })
      return [{close: true, points: points}]
    } else {
      let points: PointInfo[] = []
      let totalPart = 8 //总份数
      if (Math.abs(Math.trunc(totalLength)) === 1) totalPart = 4
      if (Math.trunc(totalLength) === 0) totalPart = 2

      let perPart = Math.abs(totalLength) / totalPart
      // console.log(
      //   '每一份', perPart,
      //   '总份', totalPart,
      //   '总长度', totalLength,
      // )
      let currentPoint
      let lastPoint = this._conf.startPoint
      let bezierCurrent
      let length14Point, length34Point = null
      //曲线长度与角度间的比例
      // let k = 100 / 90
      // startLength = k * startLength / 100
      let currentT = 0,
        length14 = 0,
        length34 = 0,
        lastT = startT
      // console.log(
      //   'lastT', lastT,
      //   'perPart', perPart,
      //   'currentT', currentT,
      // )
      // draw.drawRound(ctx, start)

      points.push({
        type: PointType.Single,
        point: {
          id: uuid(),
          cp1: getP2(),
          center: {
            use: true,
            x: this._conf.startPoint.x,
            y: this._conf.startPoint.y,
            px: 0,
            py: 0,
            rx: 0,
            ry: 0,
          },
          cp2: getP2(),
          type: BezierPointType.NoMirror
        }
      })

      let reverse = totalLength < 0
      currentT = lastT + (reverse ? -perPart : perPart)

      let p14 = perPart * (1 / 4)
      let p34 = perPart * (3 / 4)

      const getPoints = (inner: boolean, reverse: boolean) => {
        for (let i = 1; i <= totalPart; i++) {
          //计算1/4，3/4长度
          length14 = lastT + (reverse ? -p14 : p14)
          length34 = lastT + (reverse ? -p34 : p34)

          //默认情况下，用于计算1/4点，3/4点，可以共用一条对应的线段
          bezierCurrent = this.getLineCps(-1, currentT, inner)
          //计算当前点必须用当前长度线段的4个控制点来算
          currentPoint = Bezier.getPointByT_3(Math.decimal(currentT), bezierCurrent)
          // console.log(
          //   'length14', length14,
          //   'length34', length34,
          //   'currentT', currentT,
          //   'intCurrentT', intCurrentT,
          //   'currentPoint', currentPoint
          // )

          //计算1/4长度，3/4长度对应的点
          length14Point = Bezier.getPointByT_3(Math.decimal(length14), this.getLineCps(-1, length14, inner))
          length34Point = Bezier.getPointByT_3(Math.decimal(length34), this.getLineCps(-1, length34, inner))

          //利用1/4点、3/4点、起始点、终点，反推控制点
          let cps = Bezier.getControlPointsByLinePoint(length14Point, length34Point, lastPoint, currentPoint)

          // 因为最后一个控制点（非数组的最后一个点）默认只需center和cp1与前一个点的center和cp2的4个点，组成贝塞尔曲线
          //所以cp2是无用的，所以添加当前点时，需要把上一个点的cp2为正确的值并启用
          points[points.length - 1].point!['cp2'] = {
            use: true,
            x: cps[0].x,
            y: cps[0].y,
            px: 0,
            py: 0,
            rx: 0,
            ry: 0,
          }

          //默认不启用cp2，因为最后一个控制点，用不到
          points.push({
            type: PointType.Single,
            point: {
              id: uuid(),
              cp1: {
                use: true,
                x: cps[1].x,
                y: cps[1].y,
                px: 0,
                py: 0,
                rx: 0,
                ry: 0,
              },
              center: {
                use: true,
                x: currentPoint.x,
                y: currentPoint.y,
                px: 0,
                py: 0,
                rx: 0,
                ry: 0,
              },
              cp2: getP2(),
              type: BezierPointType.MirrorAngleAndLength
            }
          })
          lastPoint = currentPoint
          lastT = currentT
          currentT = lastT + (reverse ? -perPart : perPart)
        }
      }

      getPoints(false, reverse)

      points.push({
        type: PointType.Single,
        point: {
          id: uuid(),
          cp1: getP2(),
          center: {
            use: true,
            x: this._conf.innerEndPoint.x,
            y: this._conf.innerEndPoint.y,
            px: 0,
            py: 0,
            rx: 0,
            ry: 0,
          },
          cp2: getP2(),
          type: BezierPointType.NoMirror
        }
      })

      lastPoint = this._conf.innerEndPoint
      currentT = lastT + (!reverse ? -perPart : perPart)
      getPoints(true, !reverse)

      // points.push({
      //   type: PointType.Single,
      //   point: {
      //     id: uuid(),
      //     cp1: getP2(),
      //     center: getP2(true),
      //     cp2: getP2(),
      //     type: BezierPointType.RightAngle
      //   }
      // })

      return [{close: true, points: points}]
    }
  }

  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    return helper.isInBox(mousePoint, this.conf.box)
  }

  isInShapeOnSelect(mousePoint: P, cu: CanvasUtil2): boolean {
    let {
      center
    } = this._conf
    //绝对点
    let absoluteEndMouseControlPoint = {
      x: this._conf.endOperatePoint.x + center.x,
      y: this._conf.endOperatePoint.y + center.y,
    }
    if (helper.isInPoint(mousePoint, absoluteEndMouseControlPoint, 4)) {
      document.body.style.cursor = "pointer"
      this.ellipseHoverType = EllipseHoverType.End
      return true
    }
    //绝对点
    let startMouseControlPoint = {
      x: this._conf.startOperatePoint.x + center.x,
      y: this._conf.startOperatePoint.y + center.y,
    }
    if (helper.isInPoint(mousePoint, startMouseControlPoint, 4)) {
      document.body.style.cursor = "pointer"
      this.ellipseHoverType = EllipseHoverType.Start
      return true
    }

    this.ellipseHoverType = undefined
    return false
  }

  init() {
    this.getCps()
    this.getOperatePoint()
    if (!this._conf.isComplete) {
      this.conf.lineShapes = this.getCustomPoint()
    }
  }

  getCps() {
    let {layout,} = this._conf
    let {w, h} = layout
    let w2 = w / 2, h2 = h / 2
    let ox = 0.5522848 * w2, oy = 0.5522848 * h2

    //图形为整圆时的，4个线段中间点，以及相邻两个控制点。
    let right = {
      x: w2,
      y: 0
    }
    let cp1 = {
      x: right.x,
      y: right.y + oy
    }
    let bottom = {
      x: 0,
      y: h2
    }
    let cp2 = {
      x: bottom.x + ox,
      y: bottom.y
    }
    let cp3 = {
      x: bottom.x - ox,
      y: bottom.y
    }
    let left = {
      x: -w2,
      y: 0
    }
    let cp4 = {
      x: left.x,
      y: left.y + oy
    }
    let cp5 = {
      x: left.x,
      y: left.y - oy
    }
    let top = {
      x: 0,
      y: -h2
    }
    let cp6 = {
      x: top.x - ox,
      y: top.y
    }
    let cp7 = {
      x: top.x + ox,
      y: top.y
    }
    let cp8 = {
      x: right.x,
      y: right.y - oy
    }
    this.cpMap.set('line1', [clone(cp1), clone(cp2)])
    this.cpMap.set('line2', [clone(cp3), clone(cp4)])
    this.cpMap.set('line3', [clone(cp5), clone(cp6)])
    this.cpMap.set('line4', [clone(cp7), clone(cp8)])
    this.cpMap.set('right', clone(right))
    this.cpMap.set('bottom', clone(bottom))
    this.cpMap.set('left', clone(left))
    this.cpMap.set('top', clone(top))
  }

  //获取操作点，起点和终点和内圆的拉动点
  getOperatePoint() {
    let {
      totalLength = 4,
      startT = 0,
    } = this._conf

    if (startT === 0) {
      this._conf.startPoint = this.cpMap.get('right')
    } else {
      let lineCps = this.getLineCps(-1, startT)
      this._conf.startPoint = Bezier.getPointByT_3(Math.decimal(startT), lineCps)
    }

    if (totalLength === 4) {
      this._conf.endPoint = cloneDeep(this._conf.startPoint)
    } else {
      let endLength = startT + totalLength;
      let lineCps = this.getLineCps(-1, endLength)
      this._conf.endPoint = Bezier.getPointByT_3(Math.decimal(endLength), lineCps)
    }

    //w或h有值，说明有内圆
    let lineStartPoint = {x: 0, y: 0}
    this._conf.startOperatePoint = helper.getStraightLineCenterPoint(lineStartPoint, this._conf.startPoint)
    this._conf.endOperatePoint = helper.getStraightLineCenterPoint(lineStartPoint, this._conf.endPoint)
  }

  //获取圆上的4条线段中某一条的控制点
  getLineCps(lineIndex: number = -1, length?: number, inner: boolean = false): [p1: P, p2: P, p3: P, p4: P] {
    if (length !== undefined) {
      if (length >= 0) {
        lineIndex = Math.trunc(length)
      } else {
        //小于0的话，从4开始减
        lineIndex = Math.trunc(4 + length)
      }
    }
    let key = inner ? 'inner-' : ''
    //考虑总length超出4的情况，比如起点就在3，长度3
    switch (lineIndex % 4) {
      //特殊情况，当startLength不为0时，startLength + totalLength 可能会等于4
      //等于4，直接用第一段就行
      case 4:
      case 0:
        return [
          this.cpMap.get(key + 'right'),
          this.cpMap.get(key + 'line1')[0],
          this.cpMap.get(key + 'line1')[1],
          this.cpMap.get(key + 'bottom')]
      case 1:
      case -3:
        return [
          this.cpMap.get(key + 'bottom'),
          this.cpMap.get(key + 'line2')[0],
          this.cpMap.get(key + 'line2')[1],
          this.cpMap.get(key + 'left')]
      case 2:
      case -2:
        return [
          this.cpMap.get(key + 'left'),
          this.cpMap.get(key + 'line3')[0],
          this.cpMap.get(key + 'line3')[1],
          this.cpMap.get(key + 'top')]
      case 3:
      case -1:
        return [
          this.cpMap.get(key + 'top'),
          this.cpMap.get(key + 'line4')[0],
          this.cpMap.get(key + 'line4')[1],
          this.cpMap.get(key + 'right')]
    }
    return [] as any
  }

}