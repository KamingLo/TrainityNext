import React from 'react';
import HistoryItem from './HistoryItem';
import { PurchaseItem } from './HistoryForm';

interface HistoryListProps {
  items: PurchaseItem[];
}

const HistoryList: React.FC<HistoryListProps> = ({ items }) => {
  return (
    <div className="history-list">
      {items.map((item, index) => (
        <HistoryItem key={item.orderId} item={item} index={index} />
      ))}
    </div>
  );
};

export default HistoryList;