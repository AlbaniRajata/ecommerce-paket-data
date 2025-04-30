import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.get('http://localhost:3001/users', {
        params: { username: values.username, password: values.password }
      });
      
      if (res.data.length > 0) {
        localStorage.setItem('user', JSON.stringify(res.data[0]));
        navigate('/customer/dashboard');
      } else {
        message.error('Login gagal!');
      }
    } catch (error) {
      message.error('Error: ' + error.message);
    }
  };

  return (
    <Form onFinish={onFinish} style={{ maxWidth: 300, margin: '100px auto' }}>
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;