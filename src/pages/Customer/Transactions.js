import { Table, Tag } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    axios.get(`http://localhost:3001/transactions?userId=${user.id}`)
      .then(res => setTransactions(res.data));
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Riwayat Transaksi</h2>
      <Table 
        columns={columns} 
        dataSource={transactions} 
        rowKey="id" 
      />
    </div>
  );
}