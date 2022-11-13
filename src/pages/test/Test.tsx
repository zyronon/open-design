import React, {Component} from 'react';
import {Button} from 'antd';
import './index.scss'
import {withRouter} from "../../components/WithRouter";
import {
  getBezierPointByLength,
  drawCp,
  drawRound,
  getBezier3ControlPoints,
  getDecimal,
  solveCubic
} from "../canvas/utils";
import {Colors} from "../canvas/constant";
import {BezierPoint, BezierPointType, getDefaultPoint, LineType, P2} from "../canvas/type";
import {getAngle2, jiaodu2hudu} from "../../utils";
import {clone, throttle} from "lodash";


class T extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  state = {
    clientId: '',
    ws: new WebSocket('ws://127.0.0.1:8181'),
    users: [],
    me: ''
  }

  _onMouseMove(e: any) {
    this.sendMsg({x: e.x, y: e.y})
  }

  onMouseMove = throttle(e => this._onMouseMove(e), 0)

  sendMsg = (json: any) => {
    if (this.state.ws.readyState === WebSocket.OPEN) {
      this.state.ws.send(JSON.stringify(json))
    }
  }

  onJsonMsg = (content: any) => {
    console.log('ws-onmessage', content)
    switch (content.type) {
      case 'init':
        this.setState({
          users: content.data.users.map((v: string) => {
            return {name: v, x: 0, y: 0}
          }),
          me: content.data.client_id
        })
        break
      case 'join':
        let user: any = {name: content.data.client_id, x: 0, y: 0}
        this.setState({
          users: this.state.users.concat(user)
        })
        break
      case 'logout':
        this.setState((s: any) => {
          let old = clone(s.users)
          let rIndex = old.findIndex((v: any) => v.name === content.data.client_id)
          if (rIndex > -1) {
            old.splice(rIndex, 1)
          }
          return {users: old}
        })
        break
      case 'move':
        let old: any[] = clone(this.state.users)
        let rIndex = old.findIndex((v: any) => v.name === content.data.client_id)
        if (rIndex > -1) {
          old[rIndex] = {...old[rIndex], ...content.data.message}
        }
        this.setState({users: old})
        break
    }
  }

  onmessage = (e: MessageEvent) => {
    if (e.data) {
      this.onJsonMsg(JSON.parse(e.data))
    }
  }

  componentDidMount() {
    console.log('挂载')
    this.state.ws.onopen = (e) => {
      console.log('ws-onopen', e)
    }
    this.state.ws.onmessage = this.onmessage
    this.state.ws.onclose = (e) => {
      console.log('ws-onclose', e)
    }
    window.addEventListener('mousemove', this.onMouseMove)
  }

  componentWillUnmount() {
    console.log('卸载')
    this.state.ws.close()
    window.removeEventListener('mousemove', this.onMouseMove)
  }

  nav(path: any) {
    this.props.navigate(path)
  }

  render() {
    const {users, me} = this.state
    return (
      <>
        <div className={'content'}>
          <canvas width="500" height="500"></canvas>
          <Button onClick={() => this.nav('/')}>回/</Button>
          <div>
            <div className={'user'}>自己：{me}</div>
            <div className={'user'}>用户们：</div>
            {
              users.map((v: any, i) => {
                return <div className={'user'} key={i}>{v.name}</div>
              })
            }
          </div>
        </div>
        <div className={'mouses'}>
          {
            users.map((v: any, i) => {
              return <div className={'user-mouse'} key={i} style={{left: v.x, top: v.y}}>
                <div className={'name'}>{v.name}</div>
                <div className={'mouse'}></div>
              </div>
            })
          }
        </div>
      </>
    )
  }
}

export default withRouter(T)
