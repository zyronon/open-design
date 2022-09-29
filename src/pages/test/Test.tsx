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
      y: y + h / 3 * 2
    }
    let right = {
      x: x + w,
      y: y + h / 3 * 2
    }
    //三角形
    // ctx.moveTo(top.x, top.y)
    // ctx.lineTo(left.x, left.y)
    // ctx.lineTo(right.x, right.y)
    // ctx.lineTo(top.x, top.y)

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

    //贝塞尔曲线
    ctx.moveTo(left.x, left.y)
    // ctx.bezierCurveTo2(left,top, right)
    // ctx.quadraticCurveTo2(top, right)
    ctx.quadraticCurveTo2(cp1, top)
    ctx.quadraticCurveTo2(cp2, right)
    ctx.closePath()
    let d = 4
    let lineWidth = 2
    let r = 2
    ctx.stroke()

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

    // let r: any[] = bezier([left, top, right], 20)
    // console.log(r)
    // ctx.moveTo(r[0].x, r[0].y)
    // r.slice(1).map(item => {
    //   // console.log(item)
    //   ctx.lineTo(item.x, item.y)
    // })
    // ctx.stroke()
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
