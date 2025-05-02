import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Button, Card, Spin, Modal, notification } from 'antd';
import './PackagesPage.css';

export default function PackagesPage() {
  const [activePackage, setActivePackage] = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();

  const fetchPackages = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/packages');
      setAvailablePackages(data);
    } catch (error) {
      api.error({
        message: 'Gagal memuat daftar paket',
        description: error.message,
      });
    }
  }, [api]);

  const fetchActivePackage = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));

      const { data: transactions } = await axios.get('http://localhost:3001/transactions', {
        params: { userId: user.id, status: 'completed' },
      });

      if (transactions.length > 0) {
        const sorted = transactions.sort(
          (a, b) => new Date(b.activatedAt) - new Date(a.activatedAt)
        );
        const latest = sorted[0];

        const { data: pkg } = await axios.get(`http://localhost:3001/packages/${latest.packageId}`);

        const activatedDate = new Date(latest.activatedAt);
        const validityDays = parseInt(pkg.validity.split(' ')[0]);
        const expiryDate = new Date(activatedDate);
        expiryDate.setDate(activatedDate.getDate() + validityDays);

        setActivePackage({
          ...pkg,
          activatedAt: activatedDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
        });
      } else {
        setActivePackage(null);
      }
    } catch (err) {
      api.error({
        message: 'Gagal memuat paket aktif',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [api]);

  const handlePurchase = (pkgId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const pkg = availablePackages.find((p) => p.id === pkgId);

    modal.confirm({
      title: 'Konfirmasi Pembelian',
      content: (
        <>
          <p>Anda akan membeli paket:</p>
          <strong>{pkg.name}</strong>
          <p>Harga: Rp{pkg.price.toLocaleString('id-ID')}</p>
          <p>Masa berlaku: {pkg.validity}</p>
          <p>{pkg.description}</p>
        </>
      ),
      okText: 'Beli Sekarang',
      cancelText: 'Batal',
      async onOk() {
        try {
          await axios.post('http://localhost:3001/transactions', {
            userId: user.id,
            packageId: pkgId,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
          });

          api.success({
            message: 'Pembelian Berhasil!',
            description: 'Silakan aktifkan paket di menu Aktivasi',
          });

          window.dispatchEvent(new Event('transactionCreated'));
        } catch (error) {
          api.error({ message: 'Gagal', description: error.message });
        }
      },
    });
  };

  useEffect(() => {
    fetchPackages();
    fetchActivePackage();
  }, [fetchPackages, fetchActivePackage]);

  return (
    <div className="packages-page">
      {contextHolder}
      {modalContextHolder}
      <h1 className="section-title">Paket Data Aktif</h1>

      {loading ? (
        <Spin />
      ) : activePackage ? (
        <div className="active-package-card">
            <div className="active-package-grid">
                <div className="left-col">
                <div className="pkg-name">{activePackage.name}</div>
                <div className="pkg-price">Rp{activePackage.price.toLocaleString('id-ID')}</div>
                </div>
                <div className="center-col">
                <div><strong>Masa Berlaku:</strong> {activePackage.validity}</div>
                <div><strong>Fitur:</strong> {activePackage.description}</div>
                </div>
                <div className="right-col">
                <div><strong>Diaktifkan:</strong> {new Date(activePackage.activatedAt).toLocaleString('id-ID')}</div>
                <div><strong>Berlaku hingga:</strong> {new Date(activePackage.expiryDate).toLocaleDateString('id-ID')}</div>
                </div>
            </div>
        </div>
      ) : (
        <p>Tidak ada paket aktif saat ini.</p>
      )}

      <h2 className="section-title">Paket Data Tersedia</h2>
      <p className="section-subtitle">Pembelian Paket Data Sekarang Lebih Mudah, Nikmati Semua Pilihannya</p>
      <div className="packages-grid">
        {availablePackages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`package-card ${pkg.name.includes('100GB') ? 'highlight' : ''}`}
            title={pkg.name}
            bordered={false}
          >
            <p><strong>Rp{pkg.price.toLocaleString('id-ID')}</strong></p>
            <p>{pkg.validity}</p>
            <p>{pkg.description}</p>
            <Button onClick={() => handlePurchase(pkg.id)}>Beli</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
