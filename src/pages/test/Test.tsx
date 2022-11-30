import React, {Component} from 'react'
import {Button} from 'antd'
import './index.scss'
import {withRouter} from "../../components/WithRouter"
import {clone, throttle} from "lodash"
import helper from "../canvas/utils/helper"


class T extends Component<any, any> {

  state: {
    list: any[]
  } = {
    list: []
  }

  componentDidMount() {
    let old = clone(this.state.list)
    old.push(this.test)
    old.push(this.test)
    // old.map(async (value) => await value())
    this.init()
  }

  async init() {
    let list = [this.test, this.test]
    // await this.test()
    // await this.test()
    for (let i = 0; i < list.length; i++) {
      await list[i]()
    }
  }

  async test() {
    console.log('start', Date.now())
    await helper.sleep(1000)
    console.log('end', Date.now())
    return
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
