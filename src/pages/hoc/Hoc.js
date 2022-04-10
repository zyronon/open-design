import {Link} from "react-router-dom";
import * as React from "react";
import {Button} from "antd";

class Hoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 1
    }
  }

  tt() {
    console.log(this)
    this.setState({test: 2}, () => {
      console.log(this.state.test)
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
        </main>
        <nav>
          <Link to="/layout/Home">Home</Link>
        </nav>
      </>
    );
  }
}

function withTiming(WrappedComponent) {
  return class extends WrappedComponent {
    constructor(props) {
      super(props);
      this.start = 0;
      this.end = 0;
    }

    componentWillMount() {
      super.componentWillMount && super.componentWillMount();
      this.start = Date.now();
    }

    componentDidMount() {
      super.componentDidMount && super.componentDidMount();
      this.end = Date.now();
      console.log(`${WrappedComponent.name} 组件渲染时间为 ${this.end - this.start} ms`);
    }

    render() {
      return super.render();
    }
  };
}

export default withTiming(Hoc);
