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
        <h1>Riwayat Pembelian Admin</h1>
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
  const [isLoading, setIsLoading] = useState(true);
  const [allItems, setAllItems] = useState<PurchaseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PurchaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      fetchHistoryData();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const fetchHistoryData = () => {
    // TODO: Replace dengan fetch dari API
    const dummyData: PurchaseItem[] = [
      {
        orderId: "ORD001",
        transactionId: "TRX001",
        accountInfo: "user1@email.com",
        merchant: "Merchant A",
        paymentMethod: "QRIS",
        paymentLogo: "https://via.placeholder.com/60x40?text=QRIS",
        totalAmount: "Rp 500.000",
        date: "2025-01-15",
        status: "success",
        statusText: "Berhasil",
      },
      {
        orderId: "ORD002",
        transactionId: "TRX002",
        accountInfo: "user2@email.com",
        merchant: "Merchant B",
        paymentMethod: "GoPay",
        paymentLogo: "https://via.placeholder.com/60x40?text=GoPay",
        totalAmount: "Rp 750.000",
        date: "2025-01-14",
        status: "pending",
        statusText: "Menunggu",
      },
      {
        orderId: "ORD003",
        transactionId: "TRX003",
        accountInfo: "user3@email.com",
        merchant: "Merchant C",
        paymentMethod: "OVO",
        paymentLogo: "https://via.placeholder.com/60x40?text=OVO",
        totalAmount: "Rp 300.000",
        date: "2025-01-13",
        status: "failed",
        statusText: "Gagal",
      },
      {
        orderId: "ORD004",
        transactionId: "TRX004",
        accountInfo: "user4@email.com",
        merchant: "Merchant D",
        paymentMethod: "Dana",
        paymentLogo: "https://via.placeholder.com/60x40?text=Dana",
        totalAmount: "Rp 900.000",
        date: "2025-01-12",
        status: "cancelled",
        statusText: "Dibatalkan",
      },
      {
        orderId: "ORD005",
        transactionId: "TRX005",
        accountInfo: "user5@email.com",
        merchant: "Merchant E",
        paymentMethod: "QRIS",
        paymentLogo: "https://via.placeholder.com/60x40?text=QRIS",
        totalAmount: "Rp 1.200.000",
        date: "2025-01-11",
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
        {isLoading && <LoadingScreen />}

        <div
          className="admin-history-container"
          style={{ display: isLoading ? "none" : "block" }}
        >
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
