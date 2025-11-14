"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const NoHistory = () => (
  <div className="no-history">
    <i className="bx bx-cart-alt"></i>
    <p>Mohon menunggu, data sedang diambil dan memerlukan waktu...</p>
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
            <Image
              src={item.paymentLogo}
              alt={item.paymentMethod}
              className="payment-icon"
              width={80}
              height={20}
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

interface ApiResponseItem {
  _id: string;
  user: {
    email: string;
  };
  product: {
    name: string;
  };
  createdAt: string;
}

const AdminHistoryForm: React.FC = () => {
  const [allItems, setAllItems] = useState<PurchaseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PurchaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch("/api/admin/pembayaran");
      if (!response.ok) {
        throw new Error("Failed to fetch history data");
      }
      const data = await response.json();

      // Sort data by creation date
      data.sort(
        (a: ApiResponseItem, b: ApiResponseItem) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      const productCounters: { [key: string]: number } = {};
      const formattedData = data.map((item: ApiResponseItem, index: number) => {
        const productName = item.product.name.split(" ")[0].toUpperCase();

        if (!productCounters[productName]) {
          productCounters[productName] = 1;
        } else {
          productCounters[productName]++;
        }

        const transactionId = `${productName}-${productCounters[productName]
          .toString()
          .padStart(4, "0")}`;

        return {
          orderId: `Order${(index + 1).toString().padStart(2, "0")}`,
          transactionId: transactionId,
          accountInfo: item.user.email,
          merchant: item.product.name,
          paymentMethod: "Voucher",
          paymentLogo: "/Payment/FREE.svg",
          totalAmount: "Gratis",
          date: new Date(item.createdAt).toLocaleString(),
          status: "success" as "success",
          statusText: "Berhasil",
        };
      });

      setAllItems(formattedData);
      setFilteredItems(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let filtered = allItems;

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

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
