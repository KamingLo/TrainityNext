"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Section from "@/components/sections";
import BackButton from "@/components/kaming/backbutton";
import styles from "@/styles/kaming.module.css"; // Impor file CSS utama Anda

export default function BelajarPage() {
  const params = useParams();
  const key = params.key as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;

    async function fetchCourseData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/user/product/${key}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal memuat data kursus.");
        }
        
        const data: ProductData = await res.json();
        setProduct(data);

        // Putar video pertama secara default
        if (data.video && data.video.length > 0) {
          setSelectedVideo(data.video[0]);
        }
      } catch (err: AppError) {
        if (err instanceof Error) console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [key]);

  // Handler untuk memilih video dari carousel
  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    // Scroll ke atas (opsional, tapi bagus untuk UX)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // State Loading dan Error
  if (loading) {
    return <Section><div className={styles.belajarPage_loading}>Memuat kursus...</div></Section>;
  }
  if (error) {
    return <Section><div className={styles.belajarPage_error}>Error: {error}</div></Section>;
  }
  if (!product) {
    return <Section><div>Kursus tidak ditemukan.</div></Section>;
  }

  return (
    <Section>
      <div className={styles.belajarPage_header}>
        <BackButton />
      </div>

      {/* 2. IFRAME PLAYER */}
      <div className={styles.belajarPage_playerWrapper}>
        {selectedVideo ? (
          <iframe
            key={selectedVideo._id} // Penting agar iframe me-refresh
            src={`https://www.youtube.com/embed/${selectedVideo.kodePelajaran}?autoplay=1&modestbranding=1&rel=0`}
            title={selectedVideo.namaPelajaran}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className={styles.belajarPage_noVideo}>
            Pilih video untuk diputar
          </div>
        )}
      </div>

      {/* --- STRUKTUR BARU: Panel Info --- */}
      <div className={styles.belajarPage_infoPanel}>
        <h2 className={styles.belajarPage_videoTitle}>
          {selectedVideo?.namaPelajaran || "Selamat Datang!"}
        </h2>
        <p className={styles.belajarPage_courseDesc}>
          {product.desc}
        </p>
      </div>

      {/* 1. & 3. CAROUSEL / DETAIL PELAJARAN */}
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
                  className={styles.belajarPage_thumbnailImage}
                  loading="lazy" // Tambahkan lazy loading untuk performa
                />
                <h4 className={styles.belajarPage_thumbnailTitle}>
                  {video.namaPelajaran}
                </h4>
              </div>
            ))
          ) : (
            <p className={styles.belajarPage_noVideoText}>
              Belum ada video untuk kursus ini.
            </p>
          )}
        </div>
      </div>
      
    </Section>
  );
}