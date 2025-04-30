import { Row, Col, Input } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PackageCard from './PackageCard';

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/packages')
      .then(res => setPackages(res.data));
  }, []);

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <Input.Search
        placeholder="Cari paket..."
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 24 }}
      />
      <Row gutter={[16, 16]}>
        {filteredPackages.map(pkg => (
          <Col key={pkg.id} xs={24} sm={12} md={8} lg={6}>
            <PackageCard pkg={pkg} />
          </Col>
        ))}
      </Row>
    </div>
  );
}