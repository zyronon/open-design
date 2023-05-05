import React, {Component} from 'react'
import './index.scss'
import {withRouter} from "../../components/WithRouter"
import {Bezier} from "bezier-js";
// @ts-ignore
import {Button} from "antd";
import {CodeExample} from "./a";
import {Math2} from '../../lib/designer/utils/math';


class T extends Component<any, any> {

  componentDidMount() {
    let P0 = {x: 250, y: 0}
    let P1 = {x: P0.x, y: P0.y + 100}
    let P3 = {x: 500, y: 150}
    let P2 = {x: P3.x - 50, y: P3.y}
    let curve = new Bezier(P0.x, P0.y, P1.x, P1.y, P2.x, P2.y, P3.x, P3.y);
    var code = new CodeExample(0);
    code.drawSkeleton(curve);
    code.drawCurve(curve);
    var LUT = curve.getLUT(16);
    LUT.forEach(p => code.drawCircle(p, 2));

    let t = 0.5
    let A = curve.get(t)
    code.setColor("red");
    code.drawPoint(curve.get(t));
    code.drawPoint({x: 250, y: 250});
    code.drawPoint({x: 500, y: 0});
  }

  nav(path: any) {
    this.props.navigate(path)
  }

  render() {
    return (
      <>
        <div className={'content'}>
          <canvas width="500" height="500"></canvas>
          <Button onClick={() => this.nav('/')}>回/</Button>
        </div>
      </>
    )
  }
}

export default withRouter(T)

