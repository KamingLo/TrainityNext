import React from 'react';

const PurchaseDetails = () => {
  return (
    <div className="info-section">
      <h2>PURCHASE DETAILS</h2>

      <div className="email-box">
        <label htmlFor="email-input">Email Address (Opsional)</label>
        <input 
          type="email" 
          id="email-input" 
          placeholder="Masukkan email Anda" 
        />
      </div>

      <div className="voucher-box">
        <label htmlFor="voucher-input">Kode Voucher (Opsional)</label>
        <div className="voucher-input-wrapper">
          <input 
            type="text" 
            id="voucher-input" 
            placeholder="Masukkan kode voucher" 
          />
          <span className="voucher-icon" id="voucher-icon"></span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;