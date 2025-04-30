import { Row, Col, Card, Tag, Modal, notification, Spin } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PackageCard from '../../components/Packages/PackageCard';

const { useNotification } = notification;

export default function Dashboard() {
  const [activePackage, setActivePackage] = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = useNotification();
  const [modal, modalContextHolder] = Modal.useModal();

  const fetchPackages = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/packages');
      setAvailablePackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      api.error({
        message: 'Gagal memuat daftar paket',
        description: error.message
      });
    }
  }, [api]);

  const fetchActivePackage = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      const { data: transactions } = await axios.get('http://localhost:3001/transactions', {
        params: {
          userId: user.id,
          status: 'completed'
        }
      });
  
      if (transactions.length > 0) {
        const sortedTransactions = transactions.sort((a, b) => 
          new Date(b.activatedAt) - new Date(a.activatedAt)
        );
        
        const latestTransaction = sortedTransactions[0];
        
        const { data: packageData } = await axios.get(`http://localhost:3001/packages/${latestTransaction.packageId}`);
        
        const activatedDate = new Date(latestTransaction.activatedAt);
        const validityDays = parseInt(packageData.validity.split(' ')[0]);
        const expiryDate = new Date(activatedDate);
        expiryDate.setDate(activatedDate.getDate() + validityDays);
        
        setActivePackage({
          ...packageData,
          activatedAt: latestTransaction.activatedAt,
          expiryDate: expiryDate.toISOString()
        });
      } else {
        setActivePackage(null);
      }
    } catch (error) {
      console.error('Error fetching active package:', error);
      api.error({
        message: 'Gagal memuat paket aktif',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [api]);

  const handlePurchase = (pkgId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const pkg = availablePackages.find(p => p.id === pkgId);

    if (!pkg) {
      api.error({
        message: 'Gagal',
        description: 'Paket tidak ditemukan'
      });
      return;
    }

    modal.confirm({
      title: 'Konfirmasi Pembelian',
      content: (
        <div>
          <p>Anda akan membeli paket:</p>
          <p><strong>{pkg.name}</strong></p>
          <p>Harga: Rp{pkg.price.toLocaleString('id-ID')}</p>
          <p>Masa berlaku: {pkg.validity}</p>
          <p>Deskripsi: {pkg.description}</p>
        </div>
      ),
      okText: 'Beli Sekarang',
      cancelText: 'Batal',
      async onOk() {
        try {
          await axios.post('http://localhost:3001/transactions', {
            userId: user.id,
            packageId: pkgId,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
          });
          
          api.success({
            message: 'Pembelian Berhasil!',
            description: 'Silakan aktifkan paket di menu Paket Data',
            placement: 'topRight'
          });
          
          window.dispatchEvent(new Event('transactionCreated'));
        } catch (error) {
          api.error({
            message: 'Gagal',
            description: 'Transaksi gagal: ' + error.message
          });
        }
      }
    });
  };

  useEffect(() => {
    fetchPackages();
    fetchActivePackage();
    
    const handleUpdate = () => fetchActivePackage();
    window.addEventListener('transactionUpdated', handleUpdate);
    return () => {
      window.removeEventListener('transactionUpdated', handleUpdate);
    };
  }, [fetchActivePackage, fetchPackages]);

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      {modalContextHolder}
      
      <h2>Dashboard Pelanggan</h2>
      
      <Spin spinning={loading}>
        {activePackage ? (
          <Card 
            title="Paket Data Aktif" 
            style={{ marginBottom: 24, borderRadius: 8 }}
            headStyle={{ backgroundColor: '#f0f2f5', borderRadius: '8px 8px 0 0' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ marginBottom: 8 }}>{activePackage.name}</h3>
                <p style={{ marginBottom: 4 }}>
                  <Tag color="green" style={{ marginRight: 8 }}>AKTIF</Tag>
                  Berlaku hingga: {new Date(activePackage.expiryDate).toLocaleDateString('id-ID')}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Rp{activePackage.price.toLocaleString('id-ID')}</strong>
                </p>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ marginBottom: 4 }}>
                  <strong>Masa Berlaku:</strong> {activePackage.validity}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Diaktifkan:</strong> {new Date(activePackage.activatedAt).toLocaleString('id-ID')}
                </p>
              </div>
              <div style={{ flex: 2, minWidth: 300 }}>
                <p><strong>Fitur:</strong> {activePackage.description}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card style={{ marginBottom: 24 }}>
            <p>Anda belum memiliki paket aktif</p>
          </Card>
        )}
      </Spin>

      <h3 style={{ marginTop: 16 }}>Paket Data Tersedia</h3>
      <Row gutter={[16, 16]}>
        {availablePackages.map(pkg => (
          <Col key={pkg.id} xs={24} sm={12} md={8} lg={6}>
            <PackageCard 
              pkg={pkg} 
              onPurchase={() => handlePurchase(pkg.id)} 
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}