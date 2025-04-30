import { Layout } from 'antd';
import LoginForm from '../components/Auth/LoginForm';

const { Content } = Layout;

export default function LoginPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoginForm />
      </Content>
    </Layout>
  );
}