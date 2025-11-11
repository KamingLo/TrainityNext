import React from 'react';
import { PurchaseItem } from './HistoryForm';

interface HistoryItemProps {
  item: PurchaseItem;
  index: number;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, index }) => {
  const statusClass = {
    success: 'success',
    pending: 'pending',
    failed: 'failed',
    cancelled: 'cancelled'
  }[item.status];

  const handlePayNow = () => {
    if (item.paymentUrl) {
      window.location.href = item.paymentUrl;
    } else {
      alert('URL pembayaran tidak tersedia');
    }
  };

  return (
    <div className="history-item" style={{ animationDelay: `${index * 0.1}s` }}>
      <h2>DETAIL PEMBELIAN</h2>

      <div className="detail-item">
        <span className="detail-label">Order ID:</span>
        <span className="detail-value">{item.orderId}</span>
      </div>

      <div className="detail-item">
        <span className="detail-label">ID Transaksi:</span>
        <span className="detail-value">{item.transactionId}</span>
      </div>

      <div className="detail-item">
        <span className="detail-label">Account Info:</span>
        <span className="detail-value">{item.accountInfo}</span>
      </div>

      <div className="detail-item">
        <span className="detail-label">Merchant:</span>
        <span className="detail-value">{item.merchant}</span>
      </div>

      <div className="detail-item">
        <span className="detail-label">Payment Method:</span>
        <div className="payment-logo">
          <img src={item.paymentLogo} alt={item.paymentMethod} />
        </div>
      </div>

      <div className="detail-item">
        <span className="detail-label">Total Amount:</span>
        <span className="detail-value">{item.totalAmount}</span>
      </div>

      <div className="detail-item">
        <span className="detail-label">Tanggal:</span>
        <span className="detail-value">{item.date}</span>
      </div>

      <div style={{ margin: '1rem 0' }}></div>

      <div className="detail-item">
        <span className="detail-label">Status Pembelian:</span>
        <span className={`status-badge ${statusClass}`}>{item.statusText}</span>
      </div>

      {item.status === 'pending' && (
        <div className="history-actions">
          <button className="btn-pay" onClick={handlePayNow}>
            <i className="bx bx-credit-card"></i>
            Bayar Sekarang
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;