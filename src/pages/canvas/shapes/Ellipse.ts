import {BaseShape} from "./BaseShape"
import {drawRound, getBezier3ControlPoints, getBezierPointByLength, getDecimal, renderRound} from "../utils"
import {BezierPoint, BezierPointType, EllipseConfig, getDefaultPoint, LineType, P, P2, ShapeType} from "../type"
import CanvasUtil2 from "../CanvasUtil2"
import {jiaodu2hudu} from "../../../utils"

export class Ellipse extends BaseShape {
  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  get _config(): EllipseConfig {
    return this.config as EllipseConfig
  }

  set _config(val) {
    this.config = val
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any) {
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      totalLength
    } = this._config
    const {x, y} = p
    let w2 = w / 2, h2 = h / 2

    ctx.save()
    if (rotate || flipHorizontal || flipVertical) {
    } else {
      ctx.translate(x + w2, y + h2)
    }

    if (totalLength === 4) {
      ctx.beginPath()
      ctx.ellipse(0, 0, w2, h2, jiaodu2hudu(0), 0, 2 * Math.PI) //倾斜 45°角
      ctx.closePath()
    } else {
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

      //渲染，整个圆时，所有的控制点
      let showCp = false
      if (showCp) {
        drawRound(ctx, start)
        drawRound(ctx, cp1)
        drawRound(ctx, bottom)
        drawRound(ctx, cp2)
        drawRound(ctx, cp3)
        drawRound(ctx, left)
        drawRound(ctx, cp4)
        drawRound(ctx, cp5)
        drawRound(ctx, top)
        drawRound(ctx, cp6)
        drawRound(ctx, cp7)
        drawRound(ctx, cp8)
      }

      ctx.beginPath()

      let bezierCps: BezierPoint[] = []
      // let totalLength = 3.5//总长度
      let totalPart = 8 //总份数
      if (Math.trunc(totalLength) === 1) totalPart = 4
      if (Math.trunc(totalLength) === 0) totalPart = 2
      if (totalLength === 4) {
        // ctx.ellipse(0, 0, w2, h2, jiaodu2hudu(0), 0, 2 * Math.PI); //倾斜 45°角
        // ctx.stroke();
        bezierCps.push({
          cp1: {...getDefaultPoint(true), ...cp8},
          center: {...getDefaultPoint(true), ...start},
          cp2: {...getDefaultPoint(true), ...cp1},
          type: BezierPointType.MirrorAngleAndLength
        })
        bezierCps.push({
          cp1: {...getDefaultPoint(true), ...cp2},
          center: {...getDefaultPoint(true), ...bottom},
          cp2: {...getDefaultPoint(true), ...cp3},
          type: BezierPointType.MirrorAngleAndLength
        })
        bezierCps.push({
          cp1: {...getDefaultPoint(true), ...cp4},
          center: {...getDefaultPoint(true), ...left},
          cp2: {...getDefaultPoint(true), ...cp5},
          type: BezierPointType.MirrorAngleAndLength
        })
        bezierCps.push({
          cp1: {...getDefaultPoint(true), ...cp6},
          center: {...getDefaultPoint(true), ...top},
          cp2: {...getDefaultPoint(true), ...cp7},
          type: BezierPointType.MirrorAngleAndLength
        })
        // ctx.ellipse(x,y,ox,oy)
      } else {
        let perPart = totalLength / totalPart
        // console.log('每一份', perPart)
        let currentPoint, lastPoint = start
        let bezierPrevious, bezierCurrent
        let length14Point, length34Point = null
        let intLastLength, intCurrentLength, lastLength = 0
        let currentLength = perPart
        // console.log('currentLength', currentLength, 'lastLength', lastLength)
        // drawRound(ctx, start)
        bezierCps.push({
          cp1: getDefaultPoint(),
          center: {
            use: true,
            x: start.x,
            y: start.y,
            px: 0,
            py: 0,
            rx: 0,
            ry: 0,
          },
          cp2: getDefaultPoint(),
          type: BezierPointType.NoMirror
        })
        for (let i = 1; i <= totalPart; i++) {
          intCurrentLength = Math.trunc(currentLength)
          intLastLength = Math.trunc(lastLength)

          //计算1/4，3/4长度
          let length14 = (lastLength + perPart * (1 / 4))
          let length34 = perPart * (2 / 4) + length14

          //默认情况下，用于计算1/4点，3/4点，可以共用一条对应的线段
          bezierCurrent = bezierPrevious = getBezierControlPoint(intCurrentLength)
          //计算当前点必须用当前长度线段的4个控制点来算
          currentPoint = getBezierPointByLength(getDecimal(currentLength), bezierCurrent)

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
          length14Point = getBezierPointByLength(getDecimal(length14), bezierPrevious)
          length34Point = getBezierPointByLength(getDecimal(length34), bezierCurrent)

          //利用1/4点、3/4点、起始点、终点，反推控制点
          let cps = getBezier3ControlPoints(length14Point, length34Point, lastPoint, currentPoint)

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
            cp2: getDefaultPoint(),
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

        bezierCps.push({
          cp1: getDefaultPoint(),
          center: getDefaultPoint(true),
          cp2: getDefaultPoint(),
          type: BezierPointType.RightAngle
        })
      }

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
    }

    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.strokeStyle = borderColor
    ctx.stroke()
    ctx.restore()
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: EllipseConfig): void {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate,
      type, flipVertical, flipHorizontal, children,
      totalLength,
    } = conf
    ctx.strokeStyle = 'rgb(139,80,255)'
    ctx.save()

    let r2 = 5
    //弧度
    let sweepPoint
    //起点
    let startPoint
    //内径
    let ratioPoint
    if (totalLength === 4) {
      sweepPoint = {
        x: x + w - 20,
        y: y + h / 2,
      }
    } else {
      let w2 = w / 2, h2 = h / 2
      ctx.translate(x + w2, y + h2)

      let cps = conf.getCps(Math.trunc(totalLength))

      //长度对应的点，这个点在圆上
      let lengthCp = getBezierPointByLength(Math.decimal(totalLength), cps)
      //直线的方程式y= k*x
      let k = lengthCp.y / lengthCp.x
      let halfX = lengthCp.x / 2
      sweepPoint = {x: halfX, y: k * halfX}
      startPoint = {
        x: w2 / 2,
        y: 0,
      }
      ratioPoint = {
        x: 0,
        y: 0,
      }
      renderRound(startPoint, r2, ctx, ShapeType.SELECT)
      renderRound(ratioPoint, r2, ctx, ShapeType.SELECT)
    }
    renderRound(sweepPoint, r2, ctx, ShapeType.SELECT)
    ctx.restore()
  }
}