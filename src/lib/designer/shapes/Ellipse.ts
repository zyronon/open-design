import { BaseShape } from "./BaseShape"
import { jiaodu2hudu } from "../../../utils"
import { EllipseConfig } from "../config/EllipseConfig"
import { BaseConfig, Rect } from "../config/BaseConfig"
import draw from "../utils/draw"
import { BaseEvent2, BezierPoint, BezierPointType, getP2, LineShape, LineType, P, P2 } from "../types/type"
import { Math2 } from "../utils/math"
import CanvasUtil2 from "../engine/CanvasUtil2"
import { v4 as uuid } from "uuid"

/**
 * @desc 获取长度对应的 鼠标控制点
 * */
const getMouseControlPointByLength = (length: number, p: P) => {
  //直线的方程式y= k*x
  //如果超过半个象限，那么公式相反，这里要注意startLength 等于整数的特殊情况
  let isYkx = Math.decimal(length) < 0.5
  switch (Math.trunc(length)) {
    case 0:
    case 2:
      isYkx = Math.decimal(length) < 0.5
      break
    case 1:
    case 3:
      isYkx = Math.decimal(length) > 0.5
      break
  }

  let d = 30
  let sx, sy, k2
  if (isYkx) {
    k2 = p.y / p.x
    sx = p.x
    sx = sx < 0 ? sx + d : sx - d
    sy = sx * k2
  } else {
    k2 = p.x / p.y
    sy = p.y
    sy = sy < 0 ? sy + d : sy - d
    sx = sy * k2
  }
  return { x: sx, y: sy }
}

export class Ellipse extends BaseShape {
  hoverEndMouseControlPoint: boolean = false
  enterEndMouseControlPoint: boolean = false

  get _config(): EllipseConfig {
    return this.conf as EllipseConfig
  }

  set _config(val) {
    this.conf = val
  }

  childDbClick(event: BaseEvent2, p: BaseShape[]): boolean {
    return false
  }

  childMouseDown() {
    if (this.hoverEndMouseControlPoint) {
      this.enterEndMouseControlPoint = true
      return true
    }
    return false
  }


  childMouseUp() {
    this.enterEndMouseControlPoint = false
    return false
  }

  beforeShapeIsIn() {
    if (this.enterEndMouseControlPoint) {
      return true
    }
    return false
  }

  isInOnSelect(mousePoint: P, cu: CanvasUtil2): boolean {
    let {
      x, y, w, h
    } = this._config
    //绝对点
    let absoluteEndMouseControlPoint = {
      x: this._config.endMouseControlPoint.x + x + w / 2,
      y: this._config.endMouseControlPoint.y + y + h / 2,
    }
    if (Math2.isInPoint(mousePoint, absoluteEndMouseControlPoint, 4)) {
      document.body.style.cursor = "pointer"
      this.hoverEndMouseControlPoint = true
      return true
    }
    this.hoverEndMouseControlPoint = false
    return false
  }

  isHoverIn(mousePoint: P, cu: CanvasUtil2): boolean {
    return Math2.isInBox(mousePoint, mousePoint)
  }

  drawShape(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig) {
    let {
      w, h,
      fillColor, borderColor, rotation, flipVertical, flipHorizontal,
      totalLength, startLength
    } = this._config
    const { x, y } = p
    let w2 = w / 2, h2 = h / 2

    ctx.save()
    //如果旋转、翻转，那么不需要再移动中心点
    if (rotation || flipHorizontal || flipVertical) {
    } else {
      ctx.translate(x + w2, y + h2)
    }

    //http://www.alloyteam.com/2015/07/canvas-hua-tuo-yuan-di-fang-fa/
    //这里也可以用.5和.6来算ox和oy
    let ox = 0.5522848 * w2, oy = .5522848 * h2

    //TODO 可以优化
    //图形为整圆时的，4个线段中间点，以及相邻两个控制点。
    let start = {
      x: w2,
      y: 0
    }
    let cp1 = {
      x: start.x,
      y: start.y + oy
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
      x: start.x,
      y: start.y - oy
    }
    this._config.cps = [
      start,
      cp1,
      cp2,
      bottom,
      cp3,
      cp4,
      left,
      cp5,
      cp6,
      top,
      cp7,
      cp8,
    ]
    //获取第几条曲线的所有控制点
    const getBezierControlPoint = (length: number) => {
      switch (length) {
        //特殊情况，当startLength不为0时，startLength + totalLength 可能会等于4
        //等于4，直接用第一段就行
        case 4:
        case 0:
          return [start, cp1, cp2, bottom]
        case 1:
          return [bottom, cp3, cp4, left]
        case 2:
          return [left, cp5, cp6, top]
        case 3:
          return [top, cp7, cp8, start]
      }
    }
    this._config.getCps = getBezierControlPoint

    //渲染，非整个圆时，所有的控制点
    let showNotNormalCp = false
    //渲染，整个圆时，所有的控制点
    let showNormalCp = false
    if (showNormalCp) {
      draw.drawRound(ctx, start)
      draw.drawRound(ctx, cp1)
      draw.drawRound(ctx, bottom)
      draw.drawRound(ctx, cp2)
      draw.drawRound(ctx, cp3)
      draw.drawRound(ctx, left)
      draw.drawRound(ctx, cp4)
      draw.drawRound(ctx, cp5)
      draw.drawRound(ctx, top)
      draw.drawRound(ctx, cp6)
      draw.drawRound(ctx, cp7)
      draw.drawRound(ctx, cp8)
    }

    if (startLength) {
      let intStartLength = Math.trunc(startLength)
      let startLengthCps = getBezierControlPoint(intStartLength)
      this._config.startPoint = Math2.getBezierPointByLength(Math.decimal(startLength), startLengthCps)
    }

    //是否是整圆
    let fullEllipse = totalLength === 4

    if (fullEllipse) {
      ctx.beginPath()
      ctx.ellipse(0, 0, w2, h2, jiaodu2hudu(0), 0, 2 * Math.PI) //倾斜 45°角
      ctx.closePath()
      let bezierCps: BezierPoint[] = []
      bezierCps.push({
        id: uuid(),
        cp1: { ...getP2(true), ...cp8 },
        center: { ...getP2(true), ...start },
        cp2: { ...getP2(true), ...cp1 },
        type: BezierPointType.MirrorAngleAndLength
      })
      bezierCps.push({
        id: uuid(),
        cp1: { ...getP2(true), ...cp2 },
        center: { ...getP2(true), ...bottom },
        cp2: { ...getP2(true), ...cp3 },
        type: BezierPointType.MirrorAngleAndLength
      })
      bezierCps.push({
        id: uuid(),
        cp1: { ...getP2(true), ...cp4 },
        center: { ...getP2(true), ...left },
        cp2: { ...getP2(true), ...cp5 },
        type: BezierPointType.MirrorAngleAndLength
      })
      bezierCps.push({
        id: uuid(),
        cp1: { ...getP2(true), ...cp6 },
        center: { ...getP2(true), ...top },
        cp2: { ...getP2(true), ...cp7 },
        type: BezierPointType.MirrorAngleAndLength
      })
    } else {
      ctx.beginPath()

      let bezierCps: BezierPoint[] = []
      // let totalLength = 3.5//总长度
      let totalPart = 8 //总份数
      if (Math.trunc(totalLength) === 1) totalPart = 4
      if (Math.trunc(totalLength) === 0) totalPart = 2

      let perPart = totalLength / totalPart
      // console.log('每一份', perPart)
      let currentPoint
      let lastPoint = start
      let bezierPrevious, bezierCurrent
      let length14Point, length34Point = null
      let intLastLength, intCurrentLength, lastLength = 0
      let currentLength = perPart
      // console.log('currentLength', currentLength, 'lastLength', lastLength)
      // draw.drawRound(ctx, start)

      if (startLength) {
        //曲线长度与角度间的比例
        // let k = 100 / 90
        // startLength = k * startLength / 100
        lastPoint = this._config.startPoint
        lastLength = startLength
        currentLength = lastLength + perPart
        bezierCps.push({
          id: uuid(),
          cp1: getP2(),
          center: {
            use: true,
            x: this._config.startPoint.x,
            y: this._config.startPoint.y,
            px: 0,
            py: 0,
            rx: 0,
            ry: 0,
          },
          cp2: getP2(),
          type: BezierPointType.NoMirror
        })
      } else {
        bezierCps.push({
          id: uuid(),
          cp1: getP2(),
          center: {
            use: true,
            x: start.x,
            y: start.y,
            px: 0,
            py: 0,
            rx: 0,
            ry: 0,
          },
          cp2: getP2(),
          type: BezierPointType.NoMirror
        })
      }

      for (let i = 1; i <= totalPart; i++) {
        intCurrentLength = Math.trunc(currentLength)
        intLastLength = Math.trunc(lastLength)

        //计算1/4，3/4长度
        let length14 = (lastLength + perPart * (1 / 4))
        let length34 = perPart * (2 / 4) + length14

        //默认情况下，用于计算1/4点，3/4点，可以共用一条对应的线段
        bezierCurrent = bezierPrevious = getBezierControlPoint(intCurrentLength)
        //计算当前点必须用当前长度线段的4个控制点来算
        currentPoint = Math2.getBezierPointByLength(Math.decimal(currentLength), bezierCurrent)

        //特殊情况
        //如果，1/4的长度，不在当前线段内，那么肯定在上一个线段内
        if (Math.trunc(length14) !== intCurrentLength) {
          bezierPrevious = getBezierControlPoint(intCurrentLength - 1)
        }
        //如果，3/4的长度，不在当前线段内，那么肯定在上一个线段内
        if (Math.trunc(length34) !== intCurrentLength) {
          bezierCurrent = getBezierControlPoint(intCurrentLength - 1)
        }

        //计算1/4长度，3/4长度对应的点
        length14Point = Math2.getBezierPointByLength(Math.decimal(length14), bezierPrevious)
        length34Point = Math2.getBezierPointByLength(Math.decimal(length34), bezierCurrent)

        //利用1/4点、3/4点、起始点、终点，反推控制点
        let cps = Math2.getBezier3ControlPoints(length14Point, length34Point, lastPoint, currentPoint)

        // 因为最后一个控制点（非数组的最后一个点）默认只需center和cp1与前一个点的center和cp2的4个点，组成贝塞尔曲线
        //所以cp2是无用的，所以添加当前点时，需要把上一个点的cp2为正确的值并启用
        bezierCps[bezierCps.length - 1].cp2 = {
          use: true,
          x: cps[0].x,
          y: cps[0].y,
          px: 0,
          py: 0,
          rx: 0,
          ry: 0,
        }

        //默认不启用cp2，因为最后一个控制点，用不到
        bezierCps.push({
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
        })
        // ctx.beginPath()
        // ctx.moveTo(lastPoint.x, lastPoint.y)
        // ctx.bezierCurveTo2(cps[0], cps[1], currentPoint)
        // ctx.stroke()
        lastPoint = currentPoint
        lastLength = currentLength
        currentLength += perPart
      }


      this._config.endPoint = bezierCps[bezierCps.length - 1].center

      bezierCps.push({
        id: uuid(),
        cp1: getP2(),
        center: getP2(true),
        cp2: getP2(),
        type: BezierPointType.RightAngle
      })

      bezierCps.map((currentPoint: BezierPoint, index: number, array) => {
        let previousPoint: BezierPoint
        if (index === 0) {
          previousPoint = array[array.length - 1]
        } else {
          previousPoint = array[index - 1]
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
        switch (lineType) {
          case LineType.Line:
            // ctx.beginPath()
            ctx.lineTo2(previousPoint.center)
            ctx.lineTo2(currentPoint.center)
            // ctx.stroke()
            break
          case LineType.Bezier3:
            // ctx.beginPath()
            ctx.lineTo2(previousPoint.center)
            ctx.bezierCurveTo2(
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
            ctx.lineTo2(previousPoint.center)
            ctx.quadraticCurveTo2(cp!, currentPoint.center)
            // ctx.stroke()
            break
        }
      })
      ctx.closePath()

      if (showNotNormalCp) {
        bezierCps.map((currentPoint: BezierPoint) => {
          draw.drawRound(ctx, currentPoint.center)
          if (currentPoint.cp1.use) draw.controlPoint(ctx, currentPoint.cp1, currentPoint.center)
          if (currentPoint.cp2.use) draw.controlPoint(ctx, currentPoint.cp2, currentPoint.center)
        })
      }
    }

    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.strokeStyle = borderColor
    ctx.stroke()

    ctx.restore()
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, conf: EllipseConfig): void {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotation,
      type, flipVertical, flipHorizontal, children,
      totalLength,
      startLength
    } = conf
    ctx.strokeStyle = 'rgb(139,80,255)'
    ctx.save()

    let r2 = 4
    //圆终点
    let endPoint = { x: 0, y: 0 }
    //圆起点
    let startPoint = { x: 0, y: 0 }
    //圆内径
    let ratioPoint = { x: 0, y: 0 }

    let w2 = w / 2, h2 = h / 2
    ctx.translate(x + w2, y + h2)

    startPoint = getMouseControlPointByLength(startLength, this._config.startPoint)
    endPoint = getMouseControlPointByLength(startLength + totalLength, this._config.endPoint)

    ratioPoint = { x: 0, y: 0, }
    draw.drawRound(ctx, startPoint, r2)
    draw.drawRound(ctx, ratioPoint, r2,)
    draw.drawRound(ctx, endPoint, r2,)
    this._config.startMouseControlPoint = startPoint
    this._config.endMouseControlPoint = endPoint
    ctx.restore()
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
  }

  beforeEvent(event: BaseEvent2): boolean {
    return false
  }

  beforeIsInShape(): boolean {
    return false
  }

  getCustomPoint(): LineShape[] {
    return []
  }

  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    return false
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
    let { x, y, } = event.point
    let cu = CanvasUtil2.getInstance()
    let cx = x
    let cy = y
    if (this.enterEndMouseControlPoint) {

      const { x, y, w, h } = this.conf
      let w2 = w / 2, h2 = h / 2
      let ox = 0.5522848 * w2, oy = .5522848 * h2;
      let bs: any = this._config.getCps(3)

      let a, b, c, d = 0
      let p0, p1, p2, p3, p = null
      p3 = bs[3]
      p2 = bs[2]
      p1 = bs[1]
      p0 = bs[0]

      let mousePoint2 = { x: cx, y: cy }
      let k = mousePoint2.y / mousePoint2.x
      console.log('k', k, mousePoint2)
      k = (mousePoint2.y - y - h2) / (mousePoint2.x - x - w2)
      console.log('k2', k)
      draw.drawRound(cu.ctx, mousePoint2)

      let ps = [p0, p1, p2, p3]

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
      console.log('t', t)
      if (t.length) {
        // @ts-ignore
        this.conf.totalLength = 3 + t[0] ?? 0.5
        cu.render()
      }
      // let mousePoint2 = helper.getBezierPointByLength(t[0], ps)
      // console.log('mousePoint2', mousePoint2)
      // draw.drawRound(cu.ctx, mousePoint2)

      return true;
    }
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }
}