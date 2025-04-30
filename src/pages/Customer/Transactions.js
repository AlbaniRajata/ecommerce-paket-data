import { Table, Tag, Button, Modal, Descriptions, Spin, notification } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const { useNotification } = notification;

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = useNotification();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      const [transactionsRes, packagesRes] = await Promise.all([
        axios.get('http://localhost:3001/transactions', {
          params: {
            userId: user.id,
            status: 'completed'
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
    } catch (error) {
      console.error('Error:', error);
      api.error({
        message: 'Gagal memuat data',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
    
    const handleUpdate = () => {
      console.log('Received transaction update event');
      fetchData();
    };

    window.addEventListener('transactionUpdated', handleUpdate);
    return () => window.removeEventListener('transactionUpdated', handleUpdate);
  }, [fetchData]);

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
      render: (_, record) => (
        record.package 
          ? `Rp${record.package.price.toLocaleString('id-ID')}` 
          : '-'
      )
    },
    {
      title: 'Tanggal Aktivasi',
      render: (_, record) => (
        record.activatedAt 
          ? new Date(record.activatedAt).toLocaleString('id-ID') 
          : '-'
      )
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Button 
          size="small"
          onClick={() => setSelectedTransaction(record)}
        >
          Detail
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <h2>Riwayat Transaksi</h2>
      
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          locale={{
            emptyText: 'Belum ada riwayat transaksi'
          }}
        />
      </Spin>

      <Modal
        title={`Detail Transaksi`}
        open={!!selectedTransaction}
        onCancel={() => setSelectedTransaction(null)}
        footer={null}
        width={700}
      >
        {selectedTransaction && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Nama Paket" span={2}>
              {selectedTransaction.package?.name || 'Tidak tersedia'}
            </Descriptions.Item>
            <Descriptions.Item label="Harga">
              {selectedTransaction.package 
                ? `Rp${selectedTransaction.package.price.toLocaleString('id-ID')}`
                : 'Tidak tersedia'}
            </Descriptions.Item>
            <Descriptions.Item label="Deskripsi">
              {selectedTransaction.package?.description || 'Tidak ada deskripsi'}
            </Descriptions.Item>
            <Descriptions.Item label="Masa Berlaku">
              {selectedTransaction.package?.validity || 'Tidak tersedia'}
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Pembelian">
              {selectedTransaction.date}
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Aktivasi">
              {selectedTransaction.activatedAt 
                ? new Date(selectedTransaction.activatedAt).toLocaleString('id-ID')
                : 'Tidak tersedia'}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={2}>
              <Tag color="green">COMPLETED</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}