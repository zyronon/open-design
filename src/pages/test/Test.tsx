import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {bezier3, con, getCp2, renderRoundRect, renderRoundRect2} from "../canvas/utils";

class T extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    let canvas = document.querySelector('canvas');
    let ctx = canvas!.getContext('2d')!;
    ctx.clearRect(0, 0, 500, 500)
    ctx.save()
    let rect = {
      x: 50,
      y: 50,
      w: 200,
      h: 400
    }

    const {x, y, w, h} = rect
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath()
    ctx.stroke()
    let a = w / 2, b = h / 2
    let ox = 0.5 * a,
      oy = .6 * b;

    // ctx.save();
    // ctx.translate(x + a, y + b);
    // ctx.beginPath();
    // ctx.moveTo(0, b);
    // ctx.bezierCurveTo(ox, b, a, oy, a, 0);
    // ctx.bezierCurveTo(a, -oy, ox, -b, 0, -b);
    // ctx.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
    // ctx.bezierCurveTo(-a, oy, -ox, b, 0, b);
    // ctx.closePath();
    // ctx.stroke();
    // ctx.restore()

    let w2 = w / 2, h2 = h / 2
    ox = 0.5 * w2
    oy = .6 * h2;
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

    ctx.beginPath()
    ctx.translate(x + a, y + b);
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo2(cp1, cp2, bottom);
    ctx.bezierCurveTo2(cp3, cp4, left);
    ctx.stroke()

    let d = 4
    let lineWidth = 2
    let r = 2
    // renderRoundRect({
    //   x: start.x,
    //   y: start.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    // renderRoundRect({
    //   x: cp1.x,
    //   y: cp1.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    // renderRoundRect({
    //   x: bottom.x,
    //   y: bottom.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    // renderRoundRect({
    //   x: cp2.x,
    //   y: cp2.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    // renderRoundRect({
    //   x: cp3.x,
    //   y: cp3.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    // renderRoundRect({
    //   x: left.x,
    //   y: left.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    // renderRoundRect({
    //   x: cp4.x,
    //   y: cp4.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    renderRoundRect2(ctx, cp5)
    renderRoundRect2(ctx, top)
    renderRoundRect2(ctx, cp6)


    let distance = 0.6
    let item = bezier3(distance, start, cp1, cp2, bottom)
    // console.log(item)
    // renderRoundRect({
    //   x: item.x,
    //   y: item.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)

    let distance2 = 0.2
    let item2 = bezier3(distance2, bottom, cp3, cp4, left)
    // renderRoundRect({
    //   x: item2.x,
    //   y: item2.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    // ctx.moveTo(item.x, item.y)
    // ctx.quadraticCurveTo2(bottom, item2)
    // ctx.stroke()


    let total = 1 - distance + distance2
    console.log('总长：', total)
    let tp1T = (distance + total * (1 / 4))
    let laseT = 1 - tp1T
    let tp2T = total * (2 / 4) - laseT
    console.log(laseT)
    console.log(tp2T)
    let tp1: any = bezier3(tp1T, start, cp1, cp2, bottom)
    let tp2: any = bezier3(tp2T, bottom, cp3, cp4, left)
    console.log(tp1)
    // renderRoundRect({
    //   x: tp1.x,
    //   y: tp1.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    // renderRoundRect({
    //   x: tp2.x,
    //   y: tp2.y,
    //   w: 2 * d,
    //   h: 2 * d,
    //   lineWidth
    // }, r, ctx)
    let s = getCp2(tp1, tp2, item, item2)
    con(s)

    s.map(item => {
      renderRoundRect({
        x: item.x,
        y: item.y,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
    })

    ctx.moveTo(item.x, item.y)
    ctx.bezierCurveTo2(s[0], s[1], item2)
    ctx.strokeStyle = 'red'
    ctx.stroke()

    ctx.restore()
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
