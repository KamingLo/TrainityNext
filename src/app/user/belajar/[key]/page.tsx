"use client";

import { useState, useEffect } from "react";
import { useParams} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/sections";
import BackButton from "@/components/kaming/backbutton";

// Impor gaya halaman
import styles from "@/styles/kaming/belajar.module.css";
import commonStyles from "@/styles/kaming/common.module.css"; 

interface Video {
  _id: string;
  namaPelajaran: string;
  kodePelajaran: string;
}

interface ProductData {
  _id: string;
  name: string;
  desc: string;
  key: string;
  video: Video[];
  price?: number;
}

export default function BelajarPage() {
  const params = useParams();
  const key = params.key as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  
  // --- STATE BARU ---
  const [isForbidden, setIsForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Product Data (Diperbarui) ---
  useEffect(() => {
    if (!key) return;

    async function fetchCourseData() {
      setLoading(true);
      setIsForbidden(false); // Reset status
      setError(null);      // Reset status

      try {
        // DIPERBAIKI: Path API tidak menggunakan /api jika di App Router
        const res = await fetch(`/api/user/belajar/${key}`); 
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 403) {
            // DIUBAH: Set state 'forbidden', jangan redirect
            setIsForbidden(true);
            return; // Hentikan eksekusi
          }
          // Tangani error lain
          throw new Error(data.message || "Gagal memuat kursus");
        }

        const prod: ProductData = data.product;
        setProduct(prod);

        // Set video terakhir ditonton jika ada
        if (prod.video && prod.video.length > 0) {
          const lastVideo = prod.video.find(v => v._id === data.lastWatchedVideoId);
          setSelectedVideo(lastVideo || prod.video[0]);
        }
      } catch (err: AppError) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [key]); // 'router' dihapus dari dependencies, tidak diperlukan

  // --- Handler saat user pilih video (Diperbarui) ---
  const handleSelectVideo = async (video: Video) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      // DIPERBAIKI: Path API tidak menggunakan /api
      await fetch(`/api/user/belajar/${key}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastWatchedVideoId: video._id }),
      });
    } catch (err) {
      console.error("Gagal update last watched video", err);
    }
  };

  // --- Loading & Error State ---
  if (loading) {
    return <Section><div className={styles.belajarPage_loading}>Memuat kursus...</div></Section>;
  }

  // --- BLOK BARU: Menampilkan Pesan "Belum Beli" ---
  if (isForbidden) {
    return (
      <Section>
        {/* Kita bisa gunakan ulang style dari infoPanel */}
        <div className={styles.belajarPage_infoPanel} style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
          <h3 className={styles.belajarPage_carouselTitle} style={{ borderBottom: 'none', marginBottom: '1rem', fontSize: '1.5rem' }}>
            Akses Ditolak
          </h3>
          <p style={{ color: '#d1d5db', marginBottom: '2rem' }}>
            Anda harus memiliki kursus ini terlebih dahulu untuk dapat mengaksesnya.
          </p>
          <Link href="/produk" passHref className={commonStyles.buttonPrimary}>
              Lihat Daftar Kursus
          </Link>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <div className={styles.belajarPage_infoPanel} style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
          <h3 className={styles.belajarPage_carouselTitle} style={{ borderBottom: 'none', marginBottom: '1rem', fontSize: '1.5rem' }}>
            Terjadi Kesalahan
          </h3>
          <p style={{ color: '#ef4444' }}>{error}</p>
        </div>
      </Section>
    );
  }

  if (!product) {
    return <Section><div>Kursus tidak ditemukan.</div></Section>;
  }

  // --- Render Halaman Sukses ---
  return (
    <Section>
      <div className={styles.belajarPage_header}>
        <BackButton />
        <h1>{product.name}</h1>
        {product.price && <p>Harga: Rp{product.price.toLocaleString()}</p>}
      </div>

      <div className={styles.belajarPage_playerWrapper}>
        {selectedVideo ? (
          <iframe
            key={selectedVideo._id}
            src={`https://www.youtube.com/embed/${selectedVideo.kodePelajaran}?autoplay=1&modestbranding=1&rel=0`}
            title={selectedVideo.namaPelajaran}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className={styles.belajarPage_noVideo}>Pilih video untuk diputar</div>
        )}
      </div>

      <div className={styles.belajarPage_infoPanel}>
        <p className={styles.belajarPage_courseDesc}>{product.desc}</p>
      </div>

      <div className={styles.belajarPage_carouselContainer}>
        <h3 className={styles.belajarPage_carouselTitle}>Daftar Pelajaran</h3>
        <div className={styles.belajarPage_carouselScroller}>
          {product.video.length > 0 ? (
            product.video.map((video) => (
              <div
                key={video._id}
                className={`${styles.belajarPage_thumbnailCard} ${
                  selectedVideo?._id === video._id ? styles.belajarPage_thumbnailCard_active : ""
                }`}
                onClick={() => handleSelectVideo(video)}
              >
                <Image
                  src={`https://i.ytimg.com/vi/${video.kodePelajaran}/hq720.jpg`}
                  alt={video.namaPelajaran}
                  width={1280}
                  height={720}
                  className={styles.belajarPage_thumbnailImage}
                  loading="lazy"
                />
                <h4 className={styles.belajarPage_thumbnailTitle}>{video.namaPelajaran}</h4>
              </div>
            ))
          ) : (
            <p className={styles.belajarPage_noVideoText}>Belum ada video untuk kursus ini.</p>
          )}
        </div>
      </div>
    </Section>
  );
}