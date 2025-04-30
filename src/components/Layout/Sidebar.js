import { Menu } from 'antd';
import { UserOutlined, ShoppingCartOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function AppSidebar() {
  const navigate = useNavigate();
  
  const items = [
    {
      key: 'dashboard',
      icon: <UserOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/customer/dashboard')
    },
    {
      key: 'packages',
      icon: <ShoppingCartOutlined />,
      label: 'Paket Data',
      onClick: () => navigate('/customer/packages')
    },
    {
      key: 'transactions',
      icon: <HistoryOutlined />,
      label: 'Riwayat',
      onClick: () => navigate('/customer/transactions')
    }
  ];

  return (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={['dashboard']}
      items={items}
    />
  );
}