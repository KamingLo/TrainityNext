"use client";

import { Search } from "lucide-react";
import styles from '@/styles/fabio/NoCourseCard.module.css';

interface RouterLike {
  push: (url: string) => void;
}

interface NoCourseCardProps {
  router: RouterLike;
}

export default function NoCourseCard({ router }: NoCourseCardProps) {
  return (
    <div className={styles.noCourseCard}>
      <Search className={styles.noCourseIcon} />
      <h3 className={styles.noCourseTitle}>Anda Belum Memulai Kursus</h3>
      <p className={styles.noCourseDescription}>Cari kursus yang Anda minati untuk memulai perjalanan!</p>
      <button
        onClick={() => router.push("/produk")}
        className={styles.searchButton}
      >
        Cari Kursus
      </button>
    </div>
  );
}