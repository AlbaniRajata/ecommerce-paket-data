import { Button, Form, Input, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import { useState } from 'react';

const LoginForm = ({ setIsLoggedIn }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      const res = await axios.get('http://localhost:3001/users', {
        params: { username: values.username, password: values.password }
      });

      if (res.data.length > 0) {
        localStorage.setItem('user', JSON.stringify(res.data[0]));
        setIsLoggedIn(true);
        message.success('Login berhasil!');
        navigate('/');
      } else {
        message.error('Username atau password salah!');
        showModal();
      }
    } catch (error) {
      message.error('Error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <Form
        onFinish={onFinish}
        className="login-form"
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Masukkan username anda!' }]}
        >
          <Input placeholder="Masukkan username anda" className="custom-input" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Masukkan password anda!' }]}
        >
          <Input.Password placeholder="*******" className="custom-input" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-button"
            block
          >
            Masuk
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Login Error"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel} type="primary">
            Tutup
          </Button>,
        ]}
        centered
        className="custom-modal"
        icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />}
      >
        <p>Username atau Password salah. Silakan coba lagi.</p>
      </Modal>
    </div>
  );
};

export default LoginForm;
