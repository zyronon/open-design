import * as React from "react";
import style from './Login.scss'
import {Button, message, Card, Checkbox, Form, Input} from "antd";
import {useNavigate,} from "react-router-dom";

function Login() {
  const [loading, setLoading] = React.useState(false);
  let navigate = useNavigate()

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/layout')
    }, 1000);   // 模拟登录
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.warning('请填写完整信息')
  };

  return (
    <div className={style.login}>
      <div className={style.box}>
        <Card>
          <Form
            name="basic"
            labelCol={{span: 4}}
            wrapperCol={{span: 20}}
            initialValues={{remember: true}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="账号"
              name="username"
              rules={[{required: true, message: '请输入账号!'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{required: true, message: '请输入密码!'}]}
            >
              <Input.Password/>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 1, span: 20}}>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{span: 24}}>
              <Button type="primary" htmlType="submit" style={{width: '100%'}} loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Login