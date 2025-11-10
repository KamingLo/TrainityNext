import React from 'react';

interface OrderDetailProps {
  accountInfo: string;
  merchantName: string;
  paymentLogo: string;
  totalAmount: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  accountInfo,
  merchantName,
  paymentLogo,
  totalAmount,
}) => {
  return (
    <div className="detail-order">
      <h2>DETAIL PESANAN</h2>

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

      <div className="detail-item total">
        <span className="detail-label">Total Amount:</span>
        <span className="detail-value" id="total-amount">
          {totalAmount}
        </span>
      </div>
    </div>
  );
};

export default OrderDetail;