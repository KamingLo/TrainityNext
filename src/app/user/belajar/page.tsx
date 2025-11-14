"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Section from "@/components/sections";
import styles from "@/styles/kaming/owned.module.css";

interface OwnedProduct {
  _id: string;
  name: string;
  shortDesc: string;
  kodePertama: string;
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
            <div key={prod._id} className={styles.card}>
              <img
                src={`https://img.youtube.com/vi/${prod.kodePertama}/hqdefault.jpg`}
                alt={prod.name}
                className={styles.card_thumbnail}
              />

              <div className={styles.card_body}>
                <h2 className={styles.card_title}>{prod.name}</h2>
                <p className={styles.card_desc}>{prod.shortDesc}</p>

                <Link
                  href={`/user/belajar/${prod.name}`}
                  className={styles.card_button}
                >
                  Mulai Belajar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
