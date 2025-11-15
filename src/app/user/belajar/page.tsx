"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Section from "@/components/sections";
import styles from "@/styles/kaming/owned.module.css";

interface OwnedProduct {
  _id: string;
  name: string;
  kodePertama: string | null;
  progressPercentage: number;
}

export default function OwnedProductPage() {
  const [products, setProducts] = useState<OwnedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOwned() {
      try {
        const res = await fetch("/api/user/owned-product");
        const data = await res.json();
        setProducts(data.data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchOwned();
  }, []);

  if (loading) {
    return (
      <Section>
        <div className={styles.ownedPage_empty}>Memuat kursus kamu...</div>
      </Section>
    );
  }

  if (products.length === 0) {
    return (
      <Section>
        <div className={styles.ownedPage_empty}>
          Kamu belum memiliki kursus apapun.
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className={styles.ownedPage_container}>
        <h1 className={styles.ownedPage_title}>Kursus yang Kamu Miliki</h1>

        <div className={styles.ownedPage_grid}>
          {products.map((prod) => (
            <div key={prod.name} className={styles.card}>
              {prod.kodePertama && (
                <img
                  src={`https://img.youtube.com/vi/${prod.kodePertama}/hqdefault.jpg`}
                  alt={prod.name}
                  className={styles.card_thumbnail}
                />
              )}

              <div className={styles.card_body}>
                <h2 className={styles.card_title}>{prod.name}</h2>

                {prod.progressPercentage === 100 ? (
                  <p style={{ color: "#28a745", fontWeight: "bold", marginBottom: "10px" }}>
                    ✅ Kursus Selesai!
                  </p>
                ) : prod.progressPercentage > 0 ? (
                  <p style={{ color: "#ffc107", fontWeight: "bold", marginBottom: "10px" }}>
                    ⏳ Sedang Dipelajari
                  </p>
                ) : (
                  <p style={{ color: "#6c757d", marginBottom: "10px" }}>
                    💡 Belum Dimulai
                  </p>
                )}

                <div className={styles.progress_container}>
                  <div
                    className={styles.progress_bar}
                    style={{ width: `${prod.progressPercentage}%` }}
                  ></div>
                </div>

                <p className={styles.progressText}>
                  {prod.progressPercentage}% selesai
                </p>

                <Link
                  href={`/user/belajar/${prod.name}`}
                  className={styles.card_button}
                >
                  {prod.progressPercentage === 100
                    ? "Lihat Detail Kursus"
                    : prod.progressPercentage > 0
                    ? "Lanjut Belajar"
                    : "Mulai Belajar"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
