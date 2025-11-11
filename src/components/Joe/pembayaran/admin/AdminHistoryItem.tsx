import React from "react";
import { PurchaseItem } from "./AdminHistoryForm";

interface AdminHistoryItemProps {
  item: PurchaseItem;
  index: number;
}

const AdminHistoryItem: React.FC<AdminHistoryItemProps> = ({ item, index }) => {
  const statusClass = {
    success: "success",
    pending: "pending",
    failed: "failed",
    cancelled: "cancelled",
  }[item.status];

  const handleDetail = () => {
    // TODO: Navigate to detail page or open modal
    console.log("View detail for:", item.orderId);
  };

  return (
    <div
      className="admin-history-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="card-header">
        <div className="order-info">
          <span className="order-id">{item.orderId}</span>
          <span className={`status-badge ${statusClass}`}>
            {item.statusText}
          </span>
        </div>
        <span className="transaction-date">{item.date}</span>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{item.accountInfo}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Merchant:</span>
          <span className="info-value">{item.merchant}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Payment:</span>
          <div className="payment-info">
            <img
              src={item.paymentLogo}
              alt={item.paymentMethod}
              className="payment-icon"
            />
            <span>{item.paymentMethod}</span>
          </div>
        </div>

        <div className="info-row">
          <span className="info-label">transactionId:</span>
          <span className="info-value">{item.transactionId}</span>
        </div>

        <div className="info-row amount-row">
          <span className="info-label">Total:</span>
          <span className="amount-value">{item.totalAmount}</span>
        </div>
      </div>

      <div className="card-footer">
        <button className="btn-detail" onClick={handleDetail}>
          <i className="bx bx-show"></i>
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default AdminHistoryItem;
