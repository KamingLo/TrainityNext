import React from 'react';

const OrderSummary = () => {
  return (
    <>
      <h3>ORDER SUMMARY</h3>
      
      <div className="order-item">
        <img 
          src="/public/assets/Default.webp" 
          alt="Preview Video" 
          className="order-img" 
        />
        <h2 className="order-title">Judul Kursus</h2>
      </div>

      <div className="order-details">
        <div style={{ display: 'flex' }}>
          <p>Price:</p>
          <p style={{ marginLeft: 'auto' }} id="price-display">
            Rp 132.500
          </p>
        </div>
        <div 
          style={{ 
            display: 'flex', 
            borderBottom: '2px solid #333333', 
            paddingBottom: '10px', 
            marginBottom: '10px' 
          }} 
          id="discount-row"
        >
          <p>Diskon:</p>
          <p style={{ marginLeft: 'auto' }} id="discount-display">
            0%
          </p>
        </div>
        <div style={{ display: 'flex' }}>
          <h4>Total:</h4>
          <h4 style={{ marginLeft: 'auto' }} id="total-display">
            Rp 132.500
          </h4>
        </div>
      </div>

      <div className="order-agree">
        <input 
          type="checkbox" 
          id="agree-checkbox" 
          style={{ 
            transform: 'scale(1.5)', 
            accentColor: '#1369ff', 
            cursor: 'pointer' 
          }} 
        />
        <label htmlFor="agree-checkbox" style={{ cursor: 'pointer' }}>
          Dengan melanjutkan pembayaran ini, saya menyatakan telah memahami 
          dan menyetujui Syarat & Ketentuan layanan
        </label>
      </div>

      <button id="place-order" disabled>
        Place Order
      </button>
    </>
  );
};

export default OrderSummary;