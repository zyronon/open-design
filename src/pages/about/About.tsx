import {Link} from "react-router-dom";
import * as React from "react";
import {Button} from "antd";

class Ws {
  public onJson?: Function

  constructor() {
    // setTimeout(() => {
    //   this.onJson && this.onJson()
    // })
  }

  send(val: any) {
    this.onJson && this.onJson(val)
  }
}

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 1,
      ws: null,
      list: []
    }
  }

  componentDidMount() {
    let ws = new Ws()
    this.setState({ws})
    this.bindWs(ws)
  }

  bindWs(ws: any) {
    ws.onJson = (val) => {
      console.log('onJson', val)
      console.log(this.state.list)
    }
  }

  tt() {
    this.state.ws.send(1)
  }

  add() {
    this.setState(s => {
      s.list.push(s.list.length)
    })
  }

  render() {
    return (
      <>
        <main>
          <h2>Who are we?</h2>
          <p>
            That feels like an existential question, don't you
            think?
          </p>
          <p>
            {this.state.test}
          </p>
          <Button onClick={this.tt.bind(this)}>点我</Button>
          <Button onClick={this.add.bind(this)}>点我</Button>
        </main>
        <nav>
          <Link to="/layout/Home">Home</Link>
        </nav>
      </>
    );
  }
}

export default About