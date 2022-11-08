import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {
  getBezierPointByLength,
  drawCp,
  drawRound,
  getBezier3ControlPoints,
  getDecimal,
  solveCubic
} from "../canvas/utils";
import {Colors} from "../canvas/constant";
import {BezierPoint, BezierPointType, getDefaultPoint, LineType, Point2} from "../canvas/type";
import {getAngle2, jiaodu2hudu} from "../../utils";


class T extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    let canvas = document.querySelector('canvas');
    let ctx = canvas!.getContext('2d')!;
    ctx.clearRect(0, 0, 500, 500)
    ctx.rect(0, 0, 500, 500)
    ctx.stroke()
    let rect = {
      x: 100,
      y: 50,
      w: 300,
      h: 400
    }

    const {x, y, w, h} = rect
    // ctx.save()
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    // ctx.closePath()
    ctx.stroke()

    let w2 = w / 2, h2 = h / 2
    //http://www.alloyteam.com/2015/07/canvas-hua-tuo-yuan-di-fang-fa/
    //这里如果用.5和.6来算ox和oy。虽然看起来差不多，但是一条曲线上的对应比例的点的坐标，算出来的角度不正确
    //如果第一条线上比例为0.49875（总长为3.99时）的点的坐标，计算出来的角度为46度，正确的角度应该为接近45度，但绝不会超过45度
    let ox = 0.5522848 * w2, oy = .5522848 * h2;

    let center = {
      x: 0,
      y: 0
    }
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

    // ctx.beginPath()
    ctx.translate(x + w2, y + h2);
    // ctx.moveTo(start.x, start.y);
    // ctx.bezierCurveTo2(cp1, cp2, bottom);
    // ctx.bezierCurveTo2(cp3, cp4, left);
    // ctx.bezierCurveTo2(cp5, cp6, top);
    // ctx.bezierCurveTo2(cp7, cp8, start);
    // ctx.stroke()
    // ctx.restore()

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
    let totalLength = 3.5//总长度
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

    // ctx.lineTo(0, 0)
    // ctx.lineTo(start.x, start.y)
    // ctx.stroke()
    // drawRound(ctx, center)
    ctx.strokeStyle = Colors.line2
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
          let cp: Point2
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
    ctx.stroke()
    ctx.fillStyle = Colors.line
    ctx.fill()

    // console.log('bezierCps', bezierCps)

    bezierCps.map((currentPoint: BezierPoint) => {
      // drawRound(ctx, currentPoint.center)
      // if (currentPoint.cp1.use) drawCp(ctx, currentPoint.cp1, currentPoint.center)
      // if (currentPoint.cp2.use) drawCp(ctx, currentPoint.cp2, currentPoint.center)
    })

    // let last = bezierCps[bezierCps.length - 2].center
    // console.log('last', last)

    // let cp3s: any = getBezierControlPoint(3)
    // console.log('cp3s', cp3s)


    // let a = test(last.x, cp3s[1], cp3s[2])
    // console.log('a', a)


    let a, b, c, d = 0
    let p0, p1, p2, p3, p = null
    if (false) {
      p0 = {
        x: 0,
        y: 0
      }
      p1 = {
        x: p0.x + ox,
        y: p0.y
      }
      p3 = {
        x: w2,
        y: h2
      }
      p2 = {
        x: p3.x,
        y: p3.y - oy
      }
      drawRound(ctx, p0)
      drawRound(ctx, p1)
      drawRound(ctx, p2)
      drawRound(ctx, p3)

      ctx.moveTo2(p0)
      ctx.bezierCurveTo2(p1, p2, p3)
      // ctx.closePath()
      ctx.stroke()

      let p = getBezierPointByLength(0.5, [p0, p1, p2, p3])
      drawRound(ctx, p)
      console.log('p', p)
      a = p3.x - 3 * p2.x + 3 * p1.x - p0.x
      b = 3 * (p2.x - 2 * p1.x + p0.x)
      c = 3 * (p1.x - p0.x)
      d = p0.x - p.x
    } else {
      let bs: any = getBezierControlPoint(3)
      p3 = bs[3]
      p2 = bs[2]
      p1 = bs[1]
      p0 = bs[0]
      // drawRound(ctx, p0)
      // drawRound(ctx, p1)
      // drawRound(ctx, p2)
      // drawRound(ctx, p3)
      let ps = [p0, p1, p2, p3]
      p = getBezierPointByLength(0.5, ps)
      drawRound(ctx, p)
      console.log('p', p)

      a = p3.x - 3 * p2.x + 3 * p1.x - p0.x
      b = 3 * (p2.x - 2 * p1.x + p0.x)
      c = 3 * (p1.x - p0.x)
      d = p0.x - p.x

      // let t = 0.5
      // let q = pow(t, 3) * a
      //   + pow(t, 2) * b
      //   + t * c
      //   + d
      // console.log('q', q)

      // console.log(solveCubic(a, b, c, d))

      let mousePoint = p1
      let k = mousePoint.y / mousePoint.x
      let x1 = mousePoint.x + 10
      let y1 = k * x1
      let otherPoint = {x: x1, y: y1}
      drawRound(ctx, otherPoint)
      console.log('otherPoint', otherPoint)

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

      let t: any[] = solveCubic(A, B, C, D)
      t = t.filter(v => 0 <= v && v <= 1.01)
      console.log('t', t)
      let mousePoint2 = getBezierPointByLength(t[0],ps)

      drawRound(ctx, mousePoint2)

    }


  }

  nav(path: any) {
    this.props.navigate(path)
  }

  render() {
    return (
      <div className={'content'}>
        <canvas width="500" height="500"></canvas>
        <Button onClick={() => this.nav('/')}>回/</Button>
      </div>
    )
  }
}

export default withRouter(T)
