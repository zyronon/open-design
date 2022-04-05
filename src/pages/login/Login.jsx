import {Link} from "react-router-dom";
import * as React from "react";
import './Login.less'
import {Button, Checkbox, Form, Input} from "antd";

function Login() {
  return (
    <div id={'login'}>
      <div className="box">
        <Form
          name="basic"
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          initialValues={{remember: true}}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{required: true, message: 'Please input your username!'}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{required: true, message: 'Please input your password!'}]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 8, span: 16}}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{offset: 8, span: 16}}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login