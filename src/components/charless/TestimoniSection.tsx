"use client";

import React, { useState, useEffect } from 'react';
import styles from "@/styles/charless/testimoni.module.css";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
}

interface ApiReview {
  _id: string;
  userId?: {
    username?: string;
  };
  rating: number;
  comment?: string | null;
}

const StarRating = ({ rating }: { rating: number }) => {
  const numericRating = Math.max(0, Math.min(5, Math.round(rating)));
  const stars = '★'.repeat(numericRating) + '☆'.repeat(5 - numericRating);
  return <span style={{ color: '#FFD700' }}>{stars}</span>;
};

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/user/review?limit=50');

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ApiReview[] = await res.json(); 
        
        if (!Array.isArray(data)) {
          console.error("Struktur response salah. Diterima:", data);
          throw new Error("Format data tidak valid");
        }
        
        const allReviews: Review[] = data.map((review: ApiReview) => ({
          _id: review._id,
          userName: review.userId?.username || 'Anonymous',
          rating: review.rating,
          comment: review.comment || ''
        }));
        
        let filteredReviews = allReviews
          .filter((review: Review) => review.rating >= 4 && review.comment.length >= 100)
          .slice(0, 5);
        
        if (filteredReviews.length === 0) {
          console.log("Tidak ada review yang memenuhi kriteria, menggunakan fallback...");
          filteredReviews = allReviews
            .filter((review: Review) => review.rating >= 4)
            .slice(0, 5);
        }
        
        setReviews(filteredReviews);
      } catch (err: unknown) { 
        console.error("Error fetching reviews:", err);
        
        let errorMessage = "Gagal mengambil data testimoni";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);

      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            Memuat testimoni...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
            Error: {error}
          </p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            Belum ada testimoni.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Apa Kata Mereka Tentang Trainity
          </h2>
          <p className={styles.subtitle}>
            Dengarkan pengalaman nyata dari para pengguna.
          </p>
        </div>

        <div
          className={styles.slider}
          style={{
            '--width': '420px',
            '--height': '320px',
            '--quantity': reviews.length
          } as React.CSSProperties}
        >
          <div className={styles.list}>
            {reviews.map((review, index) => (
              <div
                key={review._id}
                className={styles.item}
                style={{ '--position': index + 1 } as React.CSSProperties}
              >
                <div className={styles.testimonialCard}>
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{review.userName}</h3>
                    <p className={styles.userInstitution}>
                      <StarRating rating={review.rating} />
                    </p>
                  </div>
                  <p className={styles.quote}>
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;