import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {getBezierPointByLength, drawCp, drawRound, getBezier3ControlPoints, getDecimal} from "../canvas/utils";
import {Colors} from "../canvas/constant";
import {BezierPoint, BezierPointType, getDefaultPoint, LineType, P2} from "../canvas/type";
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
      x: 50,
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
    let totalLength = 2.9//总长度
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
      console.log('每一份', perPart)

      let currentP, lastP = start
      let bezier1, bezier2
      let tp1, tp2, laseT, tp2Length, tp1Length = null
      let intLastLength, intCurrentLength, lastLength = 0
      let currentLength = perPart
      let temp2 = null
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
        //上个点和当前点，上个点加上第一段长度和当前点。如果都在同一段
        if (intCurrentLength === intLastLength && Math.trunc(lastLength + perPart) === intCurrentLength) {
          tp1Length = (getDecimal(lastLength) + perPart * (1 / 4))
          tp2Length = (getDecimal(lastLength) + perPart * (3 / 4))
          // tp2Length = getDecimal(perPart * (2 / 4) + tp1Length)

          switch (intCurrentLength) {
            case 0:
              bezier1 = bezier2 = [start, cp1, cp2, bottom]
              break
            case 1:
              bezier1 = bezier2 = [bottom, cp3, cp4, left]
              break
            case 2:
              bezier1 = bezier2 = [left, cp5, cp6, top]
              break
            case 3:
              bezier1 = bezier2 = [top, cp7, cp8, start]
              break
          }
        } else {
          tp1Length = (getDecimal(lastLength) + perPart * (1 / 4))
          laseT = 1 - tp1Length
          tp2Length = perPart * (2 / 4) - laseT
          // tp2Length = getDecimal(perPart * (2 / 4) + tp1Length)
          tp2Length = Math.abs(tp2Length)
          console.log('tp1Length',tp1Length)
          console.log('tp2Length',tp2Length)


          switch (intCurrentLength) {
            case 1:
              bezier1 = [start, cp1, cp2, bottom]
              bezier2 = [bottom, cp3, cp4, left]
              break
            case 2:
              bezier1 = [bottom, cp3, cp4, left]
              bezier2 = [left, cp5, cp6, top]
              break
            case 3:
              bezier1 = [left, cp5, cp6, top]
              bezier2 = [top, cp7, cp8, start]
              break
          }
        }
        currentP = getBezierPointByLength(currentLength - intCurrentLength, bezier2)
        // drawRound(ctx, currentP)
        tp1 = getBezierPointByLength(tp1Length, bezier1)
        tp2 = getBezierPointByLength(tp2Length, bezier2)
        temp2 = getBezier3ControlPoints(tp1, tp2, lastP, currentP)

        // 因为最后一个控制点（非数组的最后一个点）默认只需center和cp1与前一个点的center和cp2的4个点，组成贝塞尔曲线
        //所以cp2是无用的，所以添加当前点时，需要把上一个点的cp2为正确的值并启用
        bezierCps[bezierCps.length - 1].cp2 = {
          use: true,
          x: temp2[0].x,
          y: temp2[0].y,
          px: 0,
          py: 0,
          rx: 0,
          ry: 0,
        }

        //默认不启用cp2，因为最后一个控制点，用不到
        bezierCps.push({
          cp1: {
            use: true,
            x: temp2[1].x,
            y: temp2[1].y,
            px: 0,
            py: 0,
            rx: 0,
            ry: 0,
          },
          center: {
            use: true,
            x: currentP.x,
            y: currentP.y,
            px: 0,
            py: 0,
            rx: 0,
            ry: 0,
          },
          cp2: getDefaultPoint(),
          type: BezierPointType.MirrorAngleAndLength
        })
        // ctx.beginPath()
        // ctx.moveTo(lastP.x, lastP.y)
        // ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
        // ctx.stroke()
        lastP = currentP
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
    ctx.stroke()
    ctx.fillStyle = Colors.line
    ctx.fill()

    console.log('bezierCps', bezierCps)

    bezierCps.map((currentPoint: BezierPoint) => {
      drawRound(ctx, currentPoint.center)
      if (currentPoint.cp1.use) {
        // drawCp(ctx, currentPoint.cp1, currentPoint.center)
      }
      if (currentPoint.cp2.use) {
        // drawCp(ctx, currentPoint.cp2, currentPoint.center)
      }
    })

    // let startPoint = bezierCps[0].center
    // // let lastPoint = bezierCps[bezierCps.length - 2].center
    // let lastPoint = bezierCps[1].center
    // // console.log('startPoint', startPoint)
    // // console.log('lastPoint', lastPoint)
    // // console.log('center', center)
    // let angle = getAngle2(center as Point2, startPoint, lastPoint)
    // // angle = angle % 90
    // let a = (angle * (100 / 90)) / 100
    // console.log('s', angle)
    // console.log('a', a)
    //
    // angle = getAngle2({x: 531, y: 4511.98} as Point2, {x: 631, y: 4511.98} as Point2, {x: 646.95, y: 4638.85} as Point2)
    // console.log('s22', angle)
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
