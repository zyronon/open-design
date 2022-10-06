import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {bezier3copy, drawCp, drawRound, getCp2, getDecimal} from "../canvas/utils";
import {Colors} from "../canvas/constant";
import {BezierPoint, BezierPointType, getDefaultPoint, LineType, Point2} from "../canvas/type";
import {jiaodu2hudu} from "../../utils";

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
    let ox = 0.5 * w2, oy = .6 * h2;

    let center = {
      x: 0,
      y: 0
    }
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
    let totalT = 4
    let totalPart = 8
    if (Math.trunc(totalT) === 1) totalPart = 4
    if (Math.trunc(totalT) === 0) totalPart = 2
    if (totalT === 4) {
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
      let perPart = totalT / totalPart
      // console.log('每一份', perPart)

      let currentP, lastP = start
      let bezier1, bezier2
      let tp1, tp2, laseT, tp2T, tp1T = null
      let intLastT, intCurrentT, lastT = 0
      let currentT = perPart
      let temp2 = null
      // console.log('currentT', currentT, 'lastT', lastT)
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
        intCurrentT = Math.trunc(currentT)
        intLastT = Math.trunc(lastT)
        //上个点和当前点，上个点加上第一段长度和当前点。如果都在同一段
        if (intCurrentT === intLastT && Math.trunc(lastT + perPart) === intCurrentT) {
          tp1T = (getDecimal(lastT) + perPart * (1 / 4))
          tp2T = (getDecimal(lastT) + perPart * (3 / 4))
          switch (intCurrentT) {
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
          tp1T = (getDecimal(lastT) + perPart * (1 / 4))
          laseT = 1 - tp1T
          tp2T = perPart * (2 / 4) - laseT
          switch (intCurrentT) {
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
        currentP = bezier3copy(currentT - intCurrentT, bezier2)
        // drawRound(ctx, currentP)
        tp1 = bezier3copy(tp1T, bezier1)
        tp2 = bezier3copy(tp2T, bezier2)
        temp2 = getCp2(tp1, tp2, lastP, currentP)

        let lastBezierCp = bezierCps[bezierCps.length - 1]
        lastBezierCp.cp2 = {
          use: true,
          x: temp2[0].x,
          y: temp2[0].y,
          px: 0,
          py: 0,
          rx: 0,
          ry: 0,
        }
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
        lastT = currentT
        currentT += perPart
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

    bezierCps.map((currentPoint: BezierPoint) => {
      drawRound(ctx, currentPoint.center)
      // if (currentPoint.cp1.use) {
      //   drawCp(ctx, currentPoint.cp1, currentPoint.center)
      // }
      // if (currentPoint.cp2.use) {
      //   drawCp(ctx, currentPoint.cp2, currentPoint.center)
      // }
    })

    return
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
