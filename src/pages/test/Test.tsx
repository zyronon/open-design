import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {connect} from "react-redux";

class T extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    let canvas = document.querySelector('canvas');
    let ctx = canvas!.getContext('2d')!;
    ctx.clearRect(0, 0, 500, 500)
    ctx.resetTransform()
    ctx.strokeStyle = 'gray'
    ctx.strokeRect(0, 0, 500, 500)
    ctx.save()

    let r = 90 * Math.PI / 180
    // ctx.translate(100, 100)
    // ctx.transform(0, r, -r, 0, 100, 100)
    ctx.setTransform(
      0, 1, 1,
      0, 0, 0
    )
    // ctx.transform(1,1,-1,1,0,0);

    // ctx.rotate(r)
    ctx.moveTo(0, 0)
    ctx.lineTo(400, 0)
    ctx.lineTo(400, 100)
    ctx.lineTo(0, 100)
    ctx.lineTo(0, 0)
    ctx.stroke()
    ctx.restore()
  }

  nav(path: any) {
    this.props.navigate(path)
  }

  render() {
    return <div>
      <canvas width="500" height="500"></canvas>
      <Button onClick={() => this.nav('/')}>回/</Button>
    </div>;
  }
}

export default withRouter(T)
