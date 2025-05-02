import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import LoginPage from './pages/Login/LoginPage';
import Home from './pages/Customer/Home';
import Transactions from './pages/Customer/Transactions';
import ActivationPage from './pages/Customer/ActivationPage';
import PackagesPage from './pages/Customer/PackagesPage';
import Header from './components/Layout/Header';

const { Content } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />
        } />
        <Route
          path="*"
          element={
            <Layout style={{ minHeight: '100vh' }}>
              <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Content style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
                <Routes>
                  <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="/customer/packages" element={isLoggedIn ? <PackagesPage /> : <Navigate to="/login" />} />
                  <Route path="/customer/activation" element={isLoggedIn ? <ActivationPage /> : <Navigate to="/login" />} />
                  <Route path="/customer/transactions" element={isLoggedIn ? <Transactions /> : <Navigate to="/login" />} />
                </Routes>
              </Content>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;