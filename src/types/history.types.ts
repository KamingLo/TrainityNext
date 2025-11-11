// types/history.types.ts

export type TransactionStatus = "success" | "pending" | "failed" | "cancelled";

export interface PurchaseItem {
  orderId: string;
  transactionId: string;
  accountInfo: string;
  merchant: string;
  paymentMethod: string;
  paymentLogo: string;
  totalAmount: string;
  date: string;
  status: TransactionStatus;
  statusText: string;
  paymentUrl?: string;
  userId?: string;
  courseId?: string;
  courseName?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface AdminHistoryHeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (status: string) => void;
  currentFilter: string;
}

export interface AdminHistoryListProps {
  items: PurchaseItem[];
}

export interface AdminHistoryItemProps {
  item: PurchaseItem;
  index: number;
}
