import React, { useState } from 'react';
import { Layout, Modal } from 'antd';
import LoginForm from '../../components/Auth/LoginForm';
import './LoginPage.css';

const { Content } = Layout;

export default function LoginPage({ setIsLoggedIn }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content className="login-page">
        <div className="login-left">
          <img src="/assets/internet.png" alt="Internet Illustration" className="login-illustration" />
          <div className="login-text">
            <h1>Internet Ngebut<br />Tanpa Ribet</h1>
            <p>Dapatkan berbagai pilihan paket data dengan harga terbaik & aktivasi instan.</p>
            <p className="highlight">Nikmati kemudahan di genggamanmu.</p>
          </div>
        </div>
        <div className="login-right">
          <img src="/assets/logo1.png" alt="Logo" className="login-logo" />
          <LoginForm setIsLoggedIn={setIsLoggedIn} showModal={showModal} />
        </div>
      </Content>

      <Modal
        title="Login Error"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <button key="back" onClick={handleCancel}>Close</button>,
        ]}
      >
        <p>Username atau Password salah. Silakan coba lagi.</p>
      </Modal>
    </Layout>
  );
}
