import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {renderRoundRect} from "../canvas/utils";

function bezier(pots: any, amount: any) {
  let pot;
  let lines;
  let ret = [];
  let points;
  for (let i = 0; i <= amount; i++) {
    points = pots.slice(0);
    lines = [];
    while (pot = points.shift()) {
      if (points.length) {
        lines.push(pointLine([pot, points[0]], i / amount));
      } else if (lines.length > 1) {
        points = lines;
        lines = [];
      } else {
        break;
      }
    }
    ret.push(lines[0]);
  }

  function pointLine(points: any, rate: any) {
    let pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
    let ret = [];
    pointA = points[0];
    pointB = points[1];
    xDistance = pointB.x - pointA.x;
    yDistance = pointB.y - pointA.y;
    pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
    tan = yDistance / xDistance;
    radian = Math.atan(tan);
    tmpPointDistance = pointDistance * rate;
    ret = {
      // @ts-ignore
      x: pointA.x + tmpPointDistance * Math.cos(radian),
      y: pointA.y + tmpPointDistance * Math.sin(radian)
    };
    return ret;
  }

  return ret;
}

//P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
//x = (1−t)3x + 3(1−t)2tx +3(1−t)t2x + t3x
function bezier3(t: number, p1: any, p2: any, p3: any, p4: any,) {
  let x = Math.pow(1 - t, 3) * p1.x + 3 * Math.pow(1 - t, 2) * t * p2.x
    + 3 * (1 - t) * Math.pow(t, 2) * p3.x + Math.pow(t, 3) * p4.x
  let y = Math.pow(1 - t, 3) * p1.y + 3 * Math.pow(1 - t, 2) * t * p2.y
    + 3 * (1 - t) * Math.pow(t, 2) * p3.y + Math.pow(t, 3) * p4.y
  return {x, y}
}

//采用https://jermmy.github.io/2016/08/01/2016-8-1-Bezier-Curve-SVG/
//t取的1/3和2/3
function getCp(tp1: any, tp2: any, p1: any, p4: any) {
  let xb = tp1.x - (8 / 27) * p1.x - (1 / 27) * p4.x
  let yb = tp1.y - (8 / 27) * p1.y - (1 / 27) * p4.y
  let xc = tp2.x - (8 / 27) * p4.x - (1 / 27) * p1.x
  let yc = tp2.y - (8 / 27) * p4.y - (1 / 27) * p1.y

  let x1 = 3 * xb - (3 / 2) * xc
  let y1 = 3 * yb - (3 / 2) * yc
  let x2 = 3 * xc - (3 / 2) * xb
  let y2 = 3 * yc - (3 / 2) * yb
  return [{x: x1, y: y1}, {x: x2, y: y2}]
}

//采用https://juejin.cn/post/6995482699037147166#heading-13
//t取的1/4和3/4，算的结果较为精准
//同样的曲线，t取的1/4和3/4的结果，比t取的1/3和2/3的结果，没有小数点
//文章最后那里写错了
// 将公式(5)和公式(6)代入化简可得：这步应该是
// P1 =(3Pc − Pd )/72
// P2 =(3Pd − Pc )/72
function getCp2(tp1: any, tp2: any, p1: any, p4: any) {
  let xb = 64 * tp1.x - 27 * p1.x - p4.x
  let yb = 64 * tp1.y - 27 * p1.y - p4.y
  let xc = 64 * tp2.x - p1.x - 27 * p4.x
  let yc = 64 * tp2.y - p1.y - 27 * p4.y

  let x1 = (3 * xb - xc) / 72
  let y1 = (3 * yb - yc) / 72
  let x2 = (3 * xc - xb) / 72
  let y2 = (3 * yc - yb) / 72
  return [{x: x1, y: y1}, {x: x2, y: y2}]
}

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
      x: 0,
      y: 100,
      w: 200,
      h: 400
    }
    const {x, y, w, h} = rect
    let top = {
      x: x + w / 2,
      y
    }
    let left = {
      x,
      y: y + h
    }
    let right = {
      x: x + w,
      y: y + h
    }
    //三角形
    ctx.moveTo(top.x, top.y)
    ctx.lineTo(left.x, left.y)
    ctx.lineTo(right.x, right.y)
    ctx.lineTo(top.x, top.y)
    ctx.closePath()

    //三角形，角为50度
    // ctx.moveTo(left.x , left.y)
    // ctx.arcTo(top.x, top.y, right.x, right.y, 50)
    // ctx.arcTo(right.x, right.y, left.x, left.y, 50)
    // ctx.arcTo(left.x, left.y, top.x, top.y, 50)
    // ctx.stroke()

    let cp1 = {
      x: top.x - w / 4,
      y: top.y
    }
    let cp2 = {
      x: top.x + w / 4,
      y: top.y
    }

    //二次贝塞尔曲线
    ctx.moveTo(left.x, left.y)
    ctx.quadraticCurveTo2(cp1, top)
    ctx.quadraticCurveTo2(cp2, right)
    ctx.closePath()

    //三次贝塞尔曲线
    ctx.moveTo(left.x, left.y)
    ctx.bezierCurveTo2(cp1, cp2, right)
    ctx.closePath()

    let step = 0.05
    ctx.moveTo(left.x, left.y)

    // for (let i = 0; i <= 1.05; i += step) {
    //   let item: any = bezier3(i, left, cp1, cp2, right)
    //   ctx.lineTo(item.x, item.y)
    //   console.log(item)
    // }


    // let r2: any[] = bezier([left, top, right], 20)
    // let r2: any[] = bezier([left, cp1, cp2, right], 20)
    // console.log(r2)
    // ctx.moveTo(r2[0].x, r2[0].y)
    // r2.slice(1).map(item => {
    //   // console.log(item)
    //   ctx.lineTo(item.x, item.y)
    // })
    ctx.stroke()

    let d = 4
    let lineWidth = 2
    let r = 2
    renderRoundRect({
      x: cp1.x,
      y: cp1.y,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    renderRoundRect({
      x: cp2.x,
      y: cp2.y,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)

    let item: any = bezier3(0.5, left, cp1, cp2, right)
    renderRoundRect({
      x: item.x,
      y: item.y,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)

    //第一种算法，反推控制点
    //https://jermmy.github.io/2016/08/01/2016-8-1-Bezier-Curve-SVG/
    // let tp1: any = bezier3(1 / 3, left, cp1, cp2, right)
    // let tp2: any = bezier3(2 / 3, left, cp1, cp2, right)
    // let s = getCp(tp1, tp2, left, right)
    // console.log(s)
    // console.log(cp1, cp2)


    // let tp1: any = bezier3(0.5 * (1 / 3), left, cp1, cp2, right)
    // let tp2: any = bezier3(0.5 * (2 / 3), left, cp1, cp2, right)
    // let s = getCp(tp1, tp2, left, item)
    // console.log(s)
    //
    // s.map(item => {
    //   renderRoundRect({
    //     x: item.x,
    //     y: item.y,
    //     w: 2 * d,
    //     h: 2 * d,
    //     lineWidth
    //   }, r, ctx)
    // })
    //
    //
    // ctx.moveTo(left.x, left.y)
    // ctx.bezierCurveTo2(s[0], s[1], item)
    // ctx.stroke()
    //end
    //end
    //end

    //
    // let tp1: any = bezier3(1 / 4, left, cp1, cp2, right)
    // let tp2: any = bezier3(3 / 4, left, cp1, cp2, right)
    // let s = getCp2(tp1, tp2, left, right)
    // console.log(s)
    // console.log(cp1, cp2)

    let tp1: any = bezier3(0.5 * (1 / 4), left, cp1, cp2, right)
    let tp2: any = bezier3(0.5 * (3 / 4), left, cp1, cp2, right)
    let s = getCp2(tp1, tp2, left, item)
    console.log(s)

    s.map(item => {
      renderRoundRect({
        x: item.x,
        y: item.y,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
    })


    ctx.moveTo(left.x, left.y)
    ctx.bezierCurveTo2(s[0], s[1], item)
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
