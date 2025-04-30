import { Table, Tag, Button, Modal, notification, Descriptions, Spin } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const { useNotification } = notification;

export default function PackagesPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState(null);
  const [api, contextHolder] = useNotification();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      const [transactionsRes, packagesRes] = await Promise.all([
        axios.get('http://localhost:3001/transactions', {
          params: {
            userId: user.id,
            status: 'pending'
          }
        }),
        axios.get('http://localhost:3001/packages')
      ]);

      const mergedData = transactionsRes.data.map(transaction => {
        const pkg = packagesRes.data.find(p => p.id.toString() === transaction.packageId.toString());
        return {
          ...transaction,
          package: pkg || null
        };
      });

      setTransactions(mergedData);
    } catch (err) {
      console.error('Error:', err);
      api.error({
        message: 'Gagal memuat data',
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
    window.addEventListener('transactionCreated', fetchData);
    return () => window.removeEventListener('transactionCreated', fetchData);
  }, [fetchData]);

  const handleActivate = async (id) => {
    setActivatingId(id);
    try {
      await axios.patch(`http://localhost:3001/transactions/${id}`, {
        status: 'completed',
        activatedAt: new Date().toISOString()
      });

      api.success({
        message: 'Paket Diaktifkan!',
        placement: 'topRight'
      });

      fetchData();
    } catch (error) {
      api.error({
        message: 'Gagal Mengaktifkan',
        description: error.message
      });
    } finally {
      setActivatingId(null);
    }
  };

  const columns = [
    {
      title: 'No',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Nama Paket',
      render: (_, record) => record.package?.name || 'Paket tidak ditemukan'
    },
    {
      title: 'Harga',
      render: (_, record) => record.package ? `Rp${record.package.price.toLocaleString('id-ID')}` : '-'
    },
    {
      title: 'Deskripsi',
      render: (_, record) => record.package?.description || '-'
    },
    {
      title: 'Status',
      render: (_, record) => <Tag color="orange">PENDING</Tag>
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" onClick={() => setSelectedItem(record)}>
            Detail
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleActivate(record.id)}
            loading={activatingId === record.id}
          >
            Aktifkan
          </Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <h2>Paket Data Anda</h2>
      
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          locale={{
            emptyText: (
              <div>
                <p>Belum ada paket data yang dibeli</p>
              </div>
            )
          }}
        />
      </Spin>

      <Modal
        title="Detail Paket"
        open={!!selectedItem}
        onCancel={() => setSelectedItem(null)}
        footer={null}
      >
        {selectedItem && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nama Paket">
              {selectedItem.package?.name || 'Tidak tersedia'}
            </Descriptions.Item>
            <Descriptions.Item label="Harga">
              {selectedItem.package ? `Rp${selectedItem.package.price.toLocaleString('id-ID')}` : 'Tidak tersedia'}
            </Descriptions.Item>
            <Descriptions.Item label="Deskripsi">
              {selectedItem.package?.description || 'Tidak ada deskripsi'}
            </Descriptions.Item>
            <Descriptions.Item label="Masa Berlaku">
              {selectedItem.package?.validity || 'Tidak tersedia'}
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Pembelian">
              {selectedItem.date}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}