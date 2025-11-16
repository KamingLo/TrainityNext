import React from "react";
import Image from "next/image";

export interface PurchaseItem {
  orderId: string;
  transactionId: string;
  accountInfo: string;
  merchant: string;
  paymentMethod: string;
  paymentLogo: string;
  totalAmount: string;
  date: string;
  status: "success" | "pending" | "failed" | "cancelled";
  statusText: string;
}

interface Props {
  item: PurchaseItem;
  index: number;
}

const AdminHistoryItem: React.FC<Props> = ({ item, index }) => {
  return (
    <div
      className="admin-history-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="card-header">
        <div className="order-info">
          <span className="order-id">{item.orderId}</span>
        </div>
        <span className="transaction-date">{item.date}</span>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{item.accountInfo}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Produk:</span>
          <span className="info-value">{item.merchant}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Pembayaran:</span>
          <div className="payment-info">
            <Image
              src={item.paymentLogo}
              alt="FREE"
              width={80}
              height={20}
              className="payment-icon"
            />
          </div>
        </div>

        <div className="info-row">
          <span className="info-label">Transaction ID:</span>
          <span className="info-value">{item.transactionId}</span>
        </div>

        <div className="info-row amount-row">
          <span className="info-label">Total:</span>
          <span className="amount-value">{item.totalAmount}</span>
        </div>
      </div>

      <div className="card-footer">
        <span className="status-badge success">{item.statusText}</span>
      </div>
    </div>
  );
};

export default AdminHistoryItem;
