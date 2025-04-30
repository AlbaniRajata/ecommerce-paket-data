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
          onClick={(e) => {
            e.stopPropagation();
            onPurchase();
          }}
          block
        >
          Beli
        </Button>
      ]}
    >
      <p><strong>Harga:</strong> Rp{pkg.price.toLocaleString()}</p>
      <p><strong>Masa Berlaku:</strong> <Tag color="blue">{pkg.validity}</Tag></p>
      <p>{pkg.description}</p>
    </Card>
  );
};

export default PackageCard;