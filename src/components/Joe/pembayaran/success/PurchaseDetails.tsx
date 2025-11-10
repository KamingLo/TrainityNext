import React from 'react';

interface PurchaseDetailsProps {
  orderId: string;
  transactionId: string;
  accountInfo: string;
  merchantName: string;
  paymentLogo: string;
  totalAmount: string;
  paymentStatus: string;
}

const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({
  orderId,
  transactionId,
  accountInfo,
  merchantName,
  paymentLogo,
  totalAmount,
  paymentStatus,
}) => {
  return (
    <div className="purchase-details">
      <h2>DETAIL PEMBELIAN</h2>

      <div className="detail-item">
        <span className="detail-label">Order ID:</span>
        <span className="detail-value" id="order-id">
          {orderId}
        </span>
      </div>

      <div className="detail-item">
        <span className="detail-label">ID Transaksi:</span>
        <span className="detail-value" id="transaction-id">
          {transactionId}
        </span>
      </div>

      <div className="detail-item">
        <span className="detail-label">Account Info:</span>
        <span className="detail-value" id="account-info">
          {accountInfo}
        </span>
      </div>

      <div className="detail-item">
        <span className="detail-label">Merchant:</span>
        <span className="detail-value" id="merchant-name">
          {merchantName}
        </span>
      </div>

      <div className="detail-item">
        <span className="detail-label">Payment Method:</span>
        <div className="payment-logo">
          <img 
            src={paymentLogo} 
            alt="Payment Method" 
            id="payment-logo" 
          />
        </div>
      </div>

      <div className="detail-item">
        <span className="detail-label">Total Amount:</span>
        <span className="detail-value" id="total-amount">
          {totalAmount}
        </span>
      </div>

      <h1></h1>

      <div className="detail-item">
        <span className="detail-label">Status Pembelian:</span>
        <span className="status-badge success" id="payment-status">
          {paymentStatus}
        </span>
      </div>
    </div>
  );
};

export default PurchaseDetails;