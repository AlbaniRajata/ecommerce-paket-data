import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const { Header: AntHeader } = Layout;

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthButton = () => {
    if (isLoggedIn) {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <AntHeader className="app-header">
    <div className="header-left">
      <img src="assets/logo1.png" alt="Logo" className="logo" />
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="header-menu"
        overflowedIndicator={null}
      >
        <Menu.Item
          key="/"
          onClick={() => navigate('/')}
          className={location.pathname === '/' ? 'active-menu' : ''}
        >
          Home
        </Menu.Item>
        <Menu.Item
          key="/customer/packages"
          onClick={() => handleMenuClick('/customer/packages')}
          className={location.pathname === '/customer/packages' ? 'active-menu' : ''}
        >
          Paket Data
        </Menu.Item>
        <Menu.Item
          key="/customer/activation"
          onClick={() => handleMenuClick('/customer/activation')}
          className={location.pathname === '/customer/activation' ? 'active-menu' : ''}
        >
          Aktivasi
        </Menu.Item>
        <Menu.Item
          key="/customer/transactions"
          onClick={() => handleMenuClick('/customer/transactions')}
          className={location.pathname === '/customer/transactions' ? 'active-menu' : ''}
        >
          Riwayat Transaksi
        </Menu.Item>
      </Menu>
    </div>
    <Button
      className="login-button"
      onClick={handleAuthButton}
    >
      {isLoggedIn ? 'Keluar' : 'Masuk'}
    </Button>
  </AntHeader>
  );
}