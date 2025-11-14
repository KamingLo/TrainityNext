"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminHistoryItem from "./AdminHistoryItem";

interface UserProduct {
  _id: string;
  user: { email: string };
  product: { name: string };
  createdAt: string;
}

export default function AdminHistoryForm() {
  const [items, setItems] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Ref untuk mencegah duplicate fetch
  const isFetchingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fungsi fetch yang tidak depend pada state page
  const fetchData = async (
    currentPage: number,
    search: string,
    reset = false,
  ) => {
    // Cegah duplicate fetch
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        search: search, // Gunakan parameter langsung, bukan state
      });

      const res = await fetch(`/api/admin/pembayaran?${params}`);
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to fetch");
      }

      const data = await res.json();
      const newItems = data.userProducts || [];

      setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
      setTotal(data.pagination.total);
      setHasMore(data.pagination.hasNext);

      // Update page hanya jika berhasil
      if (!reset) {
        setPage(currentPage + 1);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data. Cek koneksi atau hubungi developer.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Effect untuk initial load dan search dengan debounce
  useEffect(() => {
    // Clear timer sebelumnya
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set timer baru (debounce 500ms)
    debounceTimerRef.current = setTimeout(() => {
      setItems([]);
      setPage(1);
      setHasMore(true);
      fetchData(1, searchQuery, true);
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Handler untuk load more button
  const handleLoadMore = () => {
    if (!loading && hasMore && !isFetchingRef.current) {
      fetchData(page, searchQuery);
    }
  };

  const formattedItems = items.map((item, idx) => {
    const productPrefix = item.product.name.split(" ")[0].toUpperCase();
    const counter = total - idx;
    return {
      orderId: `ORD${String(counter).padStart(4, "0")}`,
      transactionId: `${productPrefix}-${String(counter).padStart(4, "0")}`,
      accountInfo: item.user.email,
      merchant: item.product.name,
      paymentMethod: "Voucher",
      paymentLogo: "/Payment/FREE.svg",
      totalAmount: "Gratis",
      date: new Date(item.createdAt).toLocaleString("id-ID"),
      status: "success" as const,
      statusText: "Berhasil",
    };
  });

  return (
    <main>
      <section>
        <div className="admin-history-container">
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
                  placeholder="Cari Email / Produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {loading && items.length === 0 ? (
            <div className="no-history">
              <i
                className="bx bx-loader-alt bx-spin"
                style={{ fontSize: "60px" }}
              ></i>
              <p>Sedang memuat data pembelian...</p>
            </div>
          ) : formattedItems.length === 0 ? (
            <div className="no-history">
              <i className="bx bx-cart-alt"></i>
              <p>Tidak ada data pembelian ditemukan</p>
            </div>
          ) : (
            <>
              <div className="admin-history-grid">
                {formattedItems.map((item, idx) => (
                  <AdminHistoryItem
                    key={item.orderId}
                    item={item}
                    index={idx}
                  />
                ))}
              </div>

              {hasMore && (
                <div style={{ textAlign: "center", margin: "2rem 0" }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    style={{
                      padding: "0.8rem 2rem",
                      background: loading ? "#444" : "#1369ff",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {loading ? "Memuat..." : "Muat Lebih Banyak"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
