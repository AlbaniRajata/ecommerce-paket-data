import { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';
import PackageCard from '../../components/Packages/PackageCard';

const Dashboard = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/packages')
      .then(res => setPackages(res.data));
  }, []);

  const handlePurchase = (packageId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    axios.post('http://localhost:3001/transactions', {
      userId: user.id,
      packageId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
  };

  return (
    <div>
      <h2>Daftar Paket Data</h2>
      <Row gutter={[16, 16]}>
        {packages.map(pkg => (
          <Col span={8} key={pkg.id}>
            <PackageCard pkg={pkg} onPurchase={handlePurchase} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;