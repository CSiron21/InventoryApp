import React from 'react';
import '../styles/InventoryTable.css';

const InventoryTable = ({ onProductSelect }) => {
  const inventoryData = [
    {
      id: 1,
      name: 'Microfiber',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center',
      purchasePrice: 50,
      salePrice: 70,
      quantity: 12,
      stockLeft: 9
    },
    {
      id: 2,
      name: 'Microfiber',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center',
      purchasePrice: 50,
      salePrice: 70,
      quantity: 12,
      stockLeft: 9
    },
    {
      id: 3,
      name: 'Microfiber',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center',
      purchasePrice: 50,
      salePrice: 70,
      quantity: 12,
      stockLeft: 9
    },
    {
      id: 4,
      name: 'Microfiber',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center',
      purchasePrice: 50,
      salePrice: 70,
      quantity: 12,
      stockLeft: 9
    },
    {
      id: 5,
      name: 'Microfiber',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center',
      purchasePrice: 50,
      salePrice: 70,
      quantity: 12,
      stockLeft: 9
    }
  ];

  const handleProductClick = (product) => {
    onProductSelect(product);
  };

  return (
    <div className="inventory-table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Purchase Price</th>
            <th>Sale Price</th>
            <th>Quantity</th>
            <th>Stock left</th>
            <th>Restock</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((product, index) => (
            <tr 
              key={product.id} 
              className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}
              onClick={() => handleProductClick(product)}
            >
              <td className="product-image-cell">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                />
              </td>
              <td className="product-name-cell">{product.name}</td>
              <td className="price-cell">{product.purchasePrice} $</td>
              <td className="price-cell">{product.salePrice} $</td>
              <td className="quantity-cell">{product.quantity}</td>
              <td className="stock-cell">{product.stockLeft}</td>
              <td className="restock-cell">
                <button className="add-button">
                  <span className="add-icon">+</span>
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;