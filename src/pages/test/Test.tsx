import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";

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
    ctx.moveTo(top.x, top.y)
    ctx.lineTo(left.x, left.y)
    ctx.lineTo(right.x, right.y)
    ctx.lineTo(top.x, top.y)

    ctx.moveTo(left.x, left.y)
    // ctx.quadraticCurveTo(top.x, top.y, right.x, right.y)

    ctx.arcTo(top.x, top.y, right.x, right.y, 50)
    ctx.arcTo(right.x, right.y, left.x, left.y, 50)
    ctx.arcTo(left.x, left.y, top.x, top.y, 50)
    // ctx.closePath()
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
