import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Customer/Dashboard';
import Transactions from './pages/Customer/Transactions';
import PackagesPage from './pages/Customer/PackagesPage';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

const { Content, Sider } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Layout>
          <Sider width={200} theme="light">
            <Sidebar />
          </Sider>
          <Content style={{ padding: '24px' }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/customer/dashboard" element={<Dashboard />} />
              <Route path="/customer/packages" element={<PackagesPage />} /> 
              <Route path="/customer/transactions" element={<Transactions />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;