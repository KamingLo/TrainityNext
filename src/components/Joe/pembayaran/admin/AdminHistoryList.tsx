import React from "react";
import AdminHistoryItem from "./AdminHistoryItem";
import { PurchaseItem } from "./AdminHistoryForm";

interface AdminHistoryListProps {
  items: PurchaseItem[];
}

const AdminHistoryList: React.FC<AdminHistoryListProps> = ({ items }) => {
  return (
    <div className="admin-history-grid">
      {items.map((item, index) => (
        <AdminHistoryItem key={item.orderId} item={item} index={index} />
      ))}
    </div>
  );
};

export default AdminHistoryList;
