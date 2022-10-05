import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {bezier3copy, drawRound, getCp2, getDecimal} from "../canvas/utils";
import {Colors} from "../canvas/constant";

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


    let totalT = 2.9
    let totalPart = 8
    if (Math.trunc(totalT) === 1) totalPart = 4
    if (Math.trunc(totalT) === 0) totalPart = 2

    let perPart = totalT / totalPart
    console.log('每一份', perPart)

    let currentP, lastP = start
    let bezier1, bezier2
    let tp1, tp2, laseT, tp2T, tp1T = null
    let intLastT, intCurrentT, lastT = 0
    let currentT = perPart
    let temp2 = null
    // console.log('currentT', currentT, 'lastT', lastT)
    ctx.strokeStyle = Colors.line
    drawRound(ctx, start)
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
      drawRound(ctx, currentP)
      tp1 = bezier3copy(tp1T, bezier1)
      tp2 = bezier3copy(tp2T, bezier2)
      temp2 = getCp2(tp1, tp2, lastP, currentP)
      ctx.beginPath()
      ctx.moveTo(lastP.x, lastP.y)
      ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
      ctx.stroke()
      lastP = currentP
      lastT = currentT
      currentT += perPart
    }

    ctx.lineTo(0, 0)
    ctx.lineTo(start.x, start.y)
    ctx.stroke()
    drawRound(ctx, center)

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
