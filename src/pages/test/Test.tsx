import React, {Component} from 'react'
import './index.scss'
import {withRouter} from "../../components/WithRouter"
import {Bezier} from "bezier-js";
// @ts-ignore
import {Button} from "antd";


class T extends Component<any, any> {

  componentDidMount() {
    setTimeout(() => {
      new Bezier(150, 40, 80, 30, 105, 150);

    })
    // var draw = function() {
    //   this.drawSkeleton(curve);
    //   this.drawCurve(curve);
    // }
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
