import { Card, Button, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const PackageCard = ({ pkg, onPurchase }) => {
  return (
    <Card
      title={pkg.name}
      actions={[
        <Button 
          type="primary" 
          icon={<ShoppingCartOutlined />}
          onClick={() => onPurchase(pkg.id)}
        >
          Beli
        </Button>
      ]}
    >
      <p><b>Harga:</b> Rp{pkg.price.toLocaleString()}</p>
      <p><b>Masa Berlaku:</b> <Tag color="blue">{pkg.validity}</Tag></p>
      <p>{pkg.description}</p>
    </Card>
  );
};

export default PackageCard;