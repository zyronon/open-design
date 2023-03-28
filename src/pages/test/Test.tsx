import React, {Component} from 'react'
import './index.scss'
import {withRouter} from "../../components/WithRouter"
import {Bezier} from "bezier-js";
// @ts-ignore
import {Button} from "antd";
import {CodeExample} from "./a";


class T extends Component<any, any> {

  componentDidMount() {
    let curve = new Bezier(0, 50, 50, 200, 300, 400, 400, 50);
    var code = new CodeExample(0);
    code.drawSkeleton(curve);
    code.drawCurve(curve);
    var LUT = curve.getLUT(16);
    LUT.forEach(p => code.drawCircle(p, 2));

    let t = 0.8
    code.setColor("red");
    code.drawPoint(curve.get(t));

    curve = new Bezier(0, 50, 50, 300, 300, 450, 400, 50);
    code.drawSkeleton(curve);
    code.drawCurve(curve);
    var LUT = curve.getLUT(16);
    LUT.forEach(p => code.drawCircle(p, 2));

    code.setColor("red");
    code.drawPoint(curve.get(t));
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

