// /app/produk/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Section from "@/components/sections";
import Link from "next/link";
import Image from "next/image";

// DIUBAH: Impor hook useDebounce
import { useDebounce } from "@/lib/hooks/useDebounce"; 

import styles from "@/styles/kaming/publicProduk.module.css";
import formStyles from "@/styles/kaming/adminProductList.module.css";

interface Product {
  _id: string;
  name: string;
  shortDesc: string;
  kodePelajaranPertama: string;
}

export default function ProdukPage() {
  const { status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // BARU: State untuk input teks (real-time)
  const [searchTerm, setSearchTerm] = useState("");
  
  // BARU: State untuk nilai yang di-debounce (menunggu 300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // DIUBAH: useEffect ini sekarang menangani SEMUA fetch data
  // (Pencarian dan pemuatan awal)
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        // Endpoint berubah berdasarkan nilai debounce
        const endpoint = debouncedSearchTerm
          ? `/api/user/product?key=${debouncedSearchTerm}` // API pencarian Anda
          : "/api/user/product"; // API untuk mengambil semua

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Gagal mengambil data produk.");

        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
        setProducts([]); // Kosongkan produk jika ada error
      } finally {
        setLoading(false);
      }
    }

    // Hanya jalankan fetch jika auth selesai
    if (!isAuthLoading) {
      fetchProducts();
    }
  }, [debouncedSearchTerm, isAuthLoading]); // <-- Pemicu utama!

  // Loading auth (dipisah agar data tidak 'flash')
  if (isAuthLoading) {
    return (
      <Section>
        <div className={styles.produkPage_loading}>Memuat sesi...</div>
      </Section>
    );
  }
  
  if (error) {
    return (
      <Section>
        <div className={styles.produkPage_error}>Error: {error}</div>
      </Section>
    );
  }

  // Logika Tombol (Tidak berubah)
  const getButton = (product: Product) => {
    if (!isLoggedIn) {
      return (
        <Link href="/auth/login" passHref>
          <button className={styles.produkPage_buyButton_disabled}>
            Login untuk Lihat
          </button>
        </Link>
      );
    }
    return (
      <Link href={`/produk/${product.name}`} passHref>
        <button className={styles.produkPage_buyButton}>Cek Produk</button>
      </Link>
    );
  };

  return (
    <Section>
      <div className={styles.produkPage_container}>
        
        <div className={styles.produkPage_hero}>
          <h1 className={styles.produkPage_title}>Telusuri Kursus Kami</h1>
          <p className={styles.produkPage_subtitle}>
            Temukan kursus yang Anda butuhkan untuk meningkatkan keahlian Anda.
          </p>
        </div>

        {/* DIUBAH: Form dan Tombol Submit Dihapus */}
        <div className={formStyles.listPage_videoFormContainer} style={{ marginBottom: '2rem' }}>
          <div className={formStyles.listPage_inputGroup}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama kursus..."
              className={formStyles.listPage_videoInput}
            />
            {/* Tombol "Cari" tidak diperlukan lagi */}
          </div>
        </div>

        {/* --- Hasil Pencarian --- */}
        {loading ? (
          <div className={styles.produkPage_loading}>Memuat produk...</div>
        ) : (
          <>
            <div className={styles.produkPage_grid}>
              {products.map((product) => (
                <div key={product._id} className={styles.produkPage_card}>
                  <div className={styles.produkPage_cardImageWrapper}>
                    <Image
                      src={`https://i.ytimg.com/vi/${product.kodePelajaranPertama}/hq720.jpg`}
                      alt={product.name}
                      fill
                      className={styles.produkPage_cardImage}
                    />
                  </div>
                  <div className={styles.produkPage_cardBody}>
                    <h3 className={styles.produkPage_cardTitle}>{product.name}</h3>
                    <p className={styles.produkPage_cardDesc}>
                      {product.shortDesc}
                    </p>

                    <div className={styles.produkPage_cardFooter}>
                      <span className={styles.produkPage_cardPrice_free}>
                        Gratis
                      </span>
                      {getButton(product)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!loading && products.length === 0 && (
              <p className={formStyles.emptyListText} style={{ marginTop: '2rem' }}>
                {searchTerm
                  ? `Tidak ada hasil untuk "${searchTerm}".`
                  : "Belum ada kursus yang tersedia."}
              </p>
            )}
          </>
        )}
      </div>
    </Section>
  );
}