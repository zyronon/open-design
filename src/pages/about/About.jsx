import {Link} from "react-router-dom";
import * as React from "react";
import {Button} from "antd";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 1
    }
  }

  tt() {
    console.log(this)
    this.setState({test: 2},()=>{
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

export default About