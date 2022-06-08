import { Link } from "react-router-dom";
import * as React from "react";
import { Button } from "antd";
import { useState } from "react";
import eventBus from "../../utils/event-bus";

function Child() {
  let [c, setC] = useState(1)
  return <Button onClick={() => eventBus.emit('notice', ++c)}>child{c}</Button>
}

class About extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      count: 2
    }
    eventBus.on('notice', (e: any) => {
      console.log('e', this.state.count)
    })
  }

  t() {
    console.log('t')
    this.setState({ count: this.state.count + 1 })
  }


  render() {
    return (
      <>
        {this.state.count}
        <Button onClick={() => this.t()}>Click</Button>
        <Child/>
      </>
    );
  }
}

export default About