import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";

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
      y: 0,
      w: 200,
      h: 500
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
    // ctx.moveTo(top.x, top.y)
    // ctx.lineTo(left.x, left.y)
    // ctx.lineTo(right.x, right.y)
    // ctx.lineTo(top.x, top.y)
    //
    // ctx.moveTo(left.x, left.y)
    //
    // ctx.arcTo(top.x, top.y, right.x, right.y, 50)
    // ctx.arcTo(right.x, right.y, left.x, left.y, 50)
    // ctx.arcTo(left.x, left.y, top.x, top.y, 50)
    // ctx.stroke()
    let r: any[] = bezier([left, top, right], 20)
    console.log(r)
    ctx.moveTo(r[0].x, r[0].y)
    r.slice(1).map(item => {
      // console.log(item)
      ctx.lineTo(item.x, item.y)
    })
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
