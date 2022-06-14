import * as React from "react";
import {Button, Input, Spin} from "antd";

class About extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      form: {
        account: '13800138000',
        password: '',
      },
      accounts: [
        '13800',
        '13801',
        '13802',
        '13803',
      ]
    }
  }

  onChange = (e: any, type: string) => {
    this.setState({form: {...this.state.form, [type]: e.currentTarget.value}})
  }

  render() {
    return <div>
      {
        this.state.error && <div>error</div>
      }
      <div style={{display: this.state.error ? "block" : 'none'}}>error</div>
      {
        this.state.accounts.map(v => {
          return <div key={v}>account:{v}</div>
        })
      }
      <Spin spinning={this.state.loading}>
        <Input value={this.state.form.account} type={'text'} onChange={(e) => this.onChange(e, 'account')}/>
        <Input value={this.state.form.password} type={'password'} onChange={(e) => this.onChange(e, 'password')}/>
        <Button onClick={() => this.setState({loading: true})}>login</Button>
        <Button onClick={() => this.setState({error: !this.state.error})}>error</Button>
      </Spin>
    </div>
  }
}

export default About