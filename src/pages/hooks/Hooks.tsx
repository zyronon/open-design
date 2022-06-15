import { useCallback, useEffect, useRef, useState } from "react";
import { memo } from "react";
import * as React from 'react'

import { Button, Checkbox, Form, Input } from "antd";
import eventBus from "../../utils/event-bus";

function Child() {
  let [c, setC] = useState(1)
  return <Button onClick={() => eventBus.emit('notice', ++c)}>child{c}</Button>
}

export default function Hooks() {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  let form = useRef()
  function tt() {
    console.log(form.current.getFieldsValue())
  }

  return (
    <Form
      ref={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={tt}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}