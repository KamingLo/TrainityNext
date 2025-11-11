"use client";

import React, { useState, useEffect } from "react";

// Import components - pastikan path sesuai dengan struktur folder Anda
const LoadingScreen = () => (
  <div id="loading-screen">
    <div className="anim"></div>
    <p>Loading</p>
  </div>
);

const NoHistory = () => (
  <div className="no-history">
    <i className="bx bx-cart-alt"></i>
    <h3>Belum Ada Riwayat Pembelian</h3>
    <p>Tidak ada transaksi yang ditemukan</p>
  </div>
);

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
  paymentUrl?: string;
}

interface AdminHistoryHeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (status: string) => void;
  currentFilter: string;
}

const AdminHistoryHeader: React.FC<AdminHistoryHeaderProps> = ({
  onSearch,
  onFilterChange,
  currentFilter,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filterOptions = [
    { value: "all", label: "Semua Status" },
    { value: "success", label: "Berhasil" },
    { value: "pending", label: "Menunggu" },
    { value: "failed", label: "Gagal" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  const currentFilterLabel =
    filterOptions.find((opt) => opt.value === currentFilter)?.label ||
    "Semua Status";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterSelect = (value: string) => {
    onFilterChange(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="admin-history-header">
      <div className="header-left">
        <h1>Pembelian User</h1>
        <p>Kelola semua transaksi pembelian kursus</p>
      </div>

      <div className="header-right">
        <div className="search-container">
          <i className="bx bx-search"></i>
          <input
            type="text"
            placeholder="Cari Order ID, Email, Merchant..."
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container" ref={dropdownRef}>
          <button
            className="filter-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <i className="bx bx-filter-alt"></i>
            <span>{currentFilterLabel}</span>
            <i
              className={`bx bx-chevron-${isDropdownOpen ? "up" : "down"}`}
            ></i>
          </button>

          {isDropdownOpen && (
            <div className="filter-dropdown">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className={`filter-option ${currentFilter === option.value ? "active" : ""}`}
                  onClick={() => handleFilterSelect(option.value)}
                >
                  {option.label}
                  {currentFilter === option.value && (
                    <i className="bx bx-check"></i>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
          <span className="info-label">Transaction ID:</span>
          <span className="info-value">{item.transactionId}</span>
        </div>

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
          </div>
        </div>

        <div className="info-row amount-row">
          <span className="info-label">Total:</span>
          <span className="amount-value">{item.totalAmount}</span>
        </div>
      </div>

      <div className="card-footer">
        <span className={`status-badge ${statusClass}`}>{item.statusText}</span>
      </div>
    </div>
  );
};

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

const AdminHistoryForm: React.FC = () => {
  const [allItems, setAllItems] = useState<PurchaseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PurchaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = () => {
    // TODO: Replace dengan fetch dari API
    const dummyData: PurchaseItem[] = [
      {
        orderId: "ORD-2025-001",
        transactionId: "TRX-ABC123456",
        accountInfo: "testing@gmail.com",
        merchant: "Javascript Advanced Course",
        paymentMethod: "BCA",
        paymentLogo: "/Payment/BCA.svg",
        totalAmount: "Rp 250.000",
        date: "10 Nov 2025, 14:30",
        status: "success",
        statusText: "Berhasil",
      },
      {
        orderId: "ORD-2025-002",
        transactionId: "TRX-DEF789012",
        accountInfo: "user@email.com",
        merchant: "React Mastery Course",
        paymentMethod: "Mandiri",
        paymentLogo: "/Payment/Mandiri.svg",
        totalAmount: "Rp 350.000",
        date: "9 Nov 2025, 10:15",
        status: "pending",
        statusText: "Menunggu",
      },
      {
        orderId: "ORD-2025-003",
        transactionId: "TRX-GHI345678",
        accountInfo: "learner@gmail.com",
        merchant: "Python for Data Science",
        paymentMethod: "BNI",
        paymentLogo: "/Payment/DANA.svg",
        totalAmount: "Rp 450.000",
        date: "8 Nov 2025, 16:45",
        status: "failed",
        statusText: "Gagal",
      },
      {
        orderId: "ORD-2025-004",
        transactionId: "TRX-JKL901234",
        accountInfo: "student@yahoo.com",
        merchant: "UI/UX Design Fundamentals",
        paymentMethod: "BRI",
        paymentLogo: "/Payment/BRI.svg",
        totalAmount: "Rp 500.000",
        date: "7 Nov 2025, 09:20",
        status: "cancelled",
        statusText: "Dibatalkan",
      },
      {
        orderId: "ORD-2025-005",
        transactionId: "TRX-MNO567890",
        accountInfo: "developer@gmail.com",
        merchant: "Node.js Backend Development",
        paymentMethod: "BCA",
        paymentLogo: "/Payment/BCA.svg",
        totalAmount: "Rp 600.000",
        date: "6 Nov 2025, 13:50",
        status: "success",
        statusText: "Berhasil",
      },
      {
        orderId: "ORD-2025-006",
        transactionId: "TRX-PQR123456",
        accountInfo: "coder@email.com",
        merchant: "Flutter Mobile Development",
        paymentMethod: "Mandiri",
        paymentLogo: "/Payment/Mandiri.svg",
        totalAmount: "Rp 700.000",
        date: "5 Nov 2025, 11:30",
        status: "success",
        statusText: "Berhasil",
      },
    ];

    setAllItems(dummyData);
    setFilteredItems(dummyData);
  };

  useEffect(() => {
    let filtered = allItems;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.transactionId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.accountInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.merchant.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, statusFilter, allItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <main>
      <section>
        <div className="admin-history-container">
          <AdminHistoryHeader
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            currentFilter={statusFilter}
          />

          {filteredItems.length > 0 ? (
            <AdminHistoryList items={filteredItems} />
          ) : (
            <NoHistory />
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminHistoryForm;
