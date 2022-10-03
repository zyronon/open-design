import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {bezier3, bezier3copy, con, getCp2, getDecimal, renderRoundRect, renderRoundRect2} from "../canvas/utils";
import {Point} from "../../types/global";

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


    ctx.beginPath()
    ctx.translate(x + w2, y + h2);
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo2(cp1, cp2, bottom);
    ctx.bezierCurveTo2(cp3, cp4, left);
    ctx.bezierCurveTo2(cp5, cp6, top);
    ctx.bezierCurveTo2(cp7, cp8, start);
    // ctx.closePath()
    ctx.stroke()
    // ctx.restore()

    let showCp = false
    if (showCp) {
      renderRoundRect2(ctx, start)
      renderRoundRect2(ctx, cp1)
      renderRoundRect2(ctx, bottom)
      renderRoundRect2(ctx, cp2)
      renderRoundRect2(ctx, cp3)
      renderRoundRect2(ctx, left)
      renderRoundRect2(ctx, cp4)
      renderRoundRect2(ctx, cp5)
      renderRoundRect2(ctx, top)
      renderRoundRect2(ctx, cp6)
      renderRoundRect2(ctx, cp7)
      renderRoundRect2(ctx, cp8)
    }


    let totalT = 3.8
    let totalPart = 8

    let perPart = totalT / totalPart
    console.log('每一份', perPart)
    for (let i = 1; i <= totalPart; i++) {
      let di = perPart * i
      // console.log(di)
    }
    // perPart = 0.475
    let currentT = perPart
    let lastT = perPart
    let d = perPart
    let one: Point = bezier3(d, start, cp1, cp2, bottom)
    let tpOne1: any = bezier3(d * (1 / 4), start, cp1, cp2, bottom)
    let tpOne2: any = bezier3(d * (3 / 4), start, cp1, cp2, bottom)
    let temp = getCp2(tpOne1, tpOne2, start, one)
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.bezierCurveTo2(temp[0], temp[1], one)
    ctx.strokeStyle = 'red'
    // ctx.closePath()
    ctx.stroke()
    renderRoundRect2(ctx, one)

    lastT = currentT
    currentT += perPart

    let d2 = perPart
    let two: Point = bezier3(d + d2, start, cp1, cp2, bottom)
    let tpTwo1: any = bezier3(d + d2 * (1 / 4), start, cp1, cp2, bottom)
    let tpTwo2: any = bezier3(d + d2 * (3 / 4), start, cp1, cp2, bottom)
    let temp2 = getCp2(tpTwo1, tpTwo2, one, two)
    ctx.beginPath()
    ctx.moveTo(one.x, one.y)
    ctx.bezierCurveTo2(temp2[0], temp2[1], two)
    ctx.strokeStyle = 'red'
    ctx.stroke()
    renderRoundRect2(ctx, two)

    let lastP = two
    lastT = currentT
    currentT += perPart

    let intCurrentT = Math.trunc(currentT)
    let intLastT = Math.trunc(lastT)
    let currentP = {x: 0, y: 0}
    if (intCurrentT !== intLastT) {
      switch (intCurrentT) {
        case 1:
          currentP = bezier3(currentT - intCurrentT, bottom, cp3, cp4, left)
          renderRoundRect2(ctx, currentP)
          let tp1T = (lastT + perPart * (1 / 4))
          let laseT = 1 - tp1T
          let tp2T = perPart * (2 / 4) - laseT

          let tp1: any = bezier3(tp1T, start, cp1, cp2, bottom)
          let tp2: any = bezier3(tp2T, bottom, cp3, cp4, left)
          let temp2 = getCp2(tp1, tp2, lastP, currentP)
          ctx.beginPath()
          ctx.moveTo(lastP.x, lastP.y)
          ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
          ctx.strokeStyle = 'red'
          ctx.stroke()
          lastP = currentP
          lastT = currentT
          currentT += perPart
      }
    }

    intCurrentT = Math.trunc(currentT)
    intLastT = Math.trunc(lastT)
    currentP = {x: 0, y: 0}
    if (intCurrentT !== intLastT) {
      switch (intCurrentT) {
        case 1:
          currentP = bezier3(currentT - intCurrentT, bottom, cp3, cp4, left)
          renderRoundRect2(ctx, currentP)
          let tp1T = (lastT + perPart * (1 / 4))
          let laseT = 1 - tp1T
          let tp2T = perPart * (2 / 4) - laseT
          let tp1: any = bezier3(tp1T, start, cp1, cp2, bottom)
          let tp2: any = bezier3(tp2T, bottom, cp3, cp4, left)
          let temp2 = getCp2(tp1, tp2, lastP, currentP)
          ctx.beginPath()
          ctx.moveTo(lastP.x, lastP.y)
          ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
          ctx.strokeStyle = 'red'
          ctx.stroke()
          lastP = currentP
          lastT = currentT
          currentT += perPart
      }
    } else {
      switch (intCurrentT) {
        case 1:
          currentP = bezier3(currentT - intCurrentT, bottom, cp3, cp4, left)
          renderRoundRect2(ctx, currentP)
          let tp1T = (lastT - 1 + perPart * (1 / 4))
          let tp2T = (lastT - 1 + perPart * (3 / 4))
          let tp1: any = bezier3(tp1T, bottom, cp3, cp4, left)
          let tp2: any = bezier3(tp2T, bottom, cp3, cp4, left)
          let temp2 = getCp2(tp1, tp2, lastP, currentP)
          ctx.beginPath()
          ctx.moveTo(lastP.x, lastP.y)
          ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
          ctx.strokeStyle = 'red'
          ctx.stroke()
          lastP = currentP
          lastT = currentT
          currentT += perPart
      }
    }

    // console.log('currentT', currentT, 'lastT', lastT)
    intCurrentT = Math.trunc(currentT)
    intLastT = Math.trunc(lastT)
    let bezier1, bezier2
    if (intCurrentT === intLastT) {
      switch (intCurrentT) {
        case 1:
          bezier1 = bezier2 = [bottom, cp3, cp4, left]
          break
        case 2:
          bezier1 = bezier2 = [left, cp5, cp6, top]
          break
      }
    } else {
      switch (intCurrentT) {
        case 1:
          bezier1 = [start, cp1, cp2, bottom]
          bezier2 = [bottom, cp3, cp4, left]
          break
        case 2:
          bezier1 = [bottom, cp3, cp4, left]
          bezier2 = [left, cp5, cp6, top]
          break
      }
    }
    currentP = bezier3copy(currentT - intCurrentT, bezier2)
    renderRoundRect2(ctx, currentP)
    let tp1T = (getDecimal(lastT) + perPart * (1 / 4))
    let laseT = 1 - tp1T
    let tp2T = perPart * (2 / 4) - laseT
    let tp1: any = bezier3copy(tp1T, bezier1)
    let tp2: any = bezier3copy(tp2T, bezier2)
    temp2 = getCp2(tp1, tp2, lastP, currentP)
    ctx.beginPath()
    ctx.moveTo(lastP.x, lastP.y)
    ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
    ctx.strokeStyle = 'red'
    ctx.stroke()
    lastP = currentP
    lastT = currentT
    currentT += perPart


    // console.log('currentT', currentT, 'lastT', lastT)
    intCurrentT = Math.trunc(currentT)
    intLastT = Math.trunc(lastT)
    if (intCurrentT === intLastT) {
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
      }
    }
    currentP = bezier3copy(currentT - intCurrentT, bezier2)
    renderRoundRect2(ctx, currentP)
    tp1 = bezier3copy(tp1T, bezier1)
    tp2 = bezier3copy(tp2T, bezier2)
    temp2 = getCp2(tp1, tp2, lastP, currentP)
    ctx.beginPath()
    ctx.moveTo(lastP.x, lastP.y)
    ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
    ctx.strokeStyle = 'red'
    ctx.stroke()
    lastP = currentP
    lastT = currentT
    currentT += perPart


    console.log('currentT', currentT, 'lastT', lastT)
    intCurrentT = Math.trunc(currentT)
    intLastT = Math.trunc(lastT)
    if (intCurrentT === intLastT) {
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
    renderRoundRect2(ctx, currentP)
    tp1 = bezier3copy(tp1T, bezier1)
    tp2 = bezier3copy(tp2T, bezier2)
    temp2 = getCp2(tp1, tp2, lastP, currentP)
    ctx.beginPath()
    ctx.moveTo(lastP.x, lastP.y)
    ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
    ctx.strokeStyle = 'red'
    ctx.stroke()
    lastP = currentP
    lastT = currentT
    currentT += perPart

    intCurrentT = Math.trunc(currentT)
    intLastT = Math.trunc(lastT)
    if (intCurrentT === intLastT) {
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
    renderRoundRect2(ctx, currentP)
    tp1 = bezier3copy(tp1T, bezier1)
    tp2 = bezier3copy(tp2T, bezier2)
    temp2 = getCp2(tp1, tp2, lastP, currentP)
    ctx.beginPath()
    ctx.moveTo(lastP.x, lastP.y)
    ctx.bezierCurveTo2(temp2[0], temp2[1], currentP)
    ctx.strokeStyle = 'red'
    ctx.stroke()
    lastP = currentP
    lastT = currentT
    currentT += perPart

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
