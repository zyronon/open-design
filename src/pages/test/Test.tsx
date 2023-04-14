import React, {Component} from 'react'
import './index.scss'
import {withRouter} from "../../components/WithRouter"
import {Button} from "antd";

class T extends Component<any, any> {

  componentDidMount() {

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

