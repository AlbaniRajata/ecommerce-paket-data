import { notification } from 'antd';

const handlePurchase = async (packageId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    await axios.post('http://localhost:3001/transactions', {
      userId: user.id,
      packageId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });

    notification.success({
      message: 'Berhasil!',
      description: 'Paket akan aktif setelah pembayaran.',
      placement: 'topRight'
    });
    
    fetchPackages(); 
  } catch (error) {
    notification.error({
      message: 'Gagal',
      description: 'Transaksi gagal. Coba lagi.',
    });
  }
};