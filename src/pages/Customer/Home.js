import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate('/customer/packages');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <p className="hero-subtitle">Baru! Pembelian Paket Data Sekarang Lebih Mudah</p>
        <h1 className="hero-title">Paket Data Cepat, Hemat dan Langsung Aktif</h1>
        <p className="hero-description">
          Temukan berbagai pilihan paket internet yang sesuai kebutuhanmu. Aktivasi instan. Riwayat transaksi tercatat. Satu klik saja.
        </p>
        <Button 
          type="button" 
          size="large" 
          className="hero-button"
          onClick={handleButtonClick}
        >
          Mulai Sekarang
        </Button>
      </section>
    </div>
  );
}