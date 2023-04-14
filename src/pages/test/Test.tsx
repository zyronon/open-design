import React, {Component} from 'react'
import './index.scss'
import {withRouter} from "../../components/WithRouter"
import {Button} from "antd";

class Parent {

  test() {
    console.log('parent-test')
  }

  init() {
    console.log('init')
    this.render()
  }

  render() {
    console.log('parent-render',)
  }
}

class Child extends Parent {

  test() {
    console.log('child-test')
  }
}

class T extends Component<any, any> {

  componentDidMount() {
    let c = new Child()
    c.init()

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

