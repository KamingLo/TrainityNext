"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Section from "@/components/sections";
import Link from "next/link";
import Image from "next/image";

import styles from "@/styles/kaming/publicProdukDetail.module.css";
import reviewStyles from "@/styles/michael/reviewUser.module.css"; // Import file CSS baru

interface Product {
  _id: string;
  name: string;
  desc: string;
  shortDesc: string;
  kodePelajaranPertama: string;
  isOwned: boolean;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export default function DetailProdukPage() {
  const { status: authStatus, data: session } = useSession();
  const isLoggedIn = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const params = useParams();
  const productKey = params.key as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk form review
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 0,
    comment: ""
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!productKey || isAuthLoading) return;

    async function fetchProductDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/product?key=${productKey}`);
        if (!res.ok) throw new Error("Gagal mengambil data produk.");

        const data: Product[] = await res.json();
        const productData = data[0];
        if (!productData) throw new Error("Produk tidak ditemukan.");

        setProduct(productData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [productKey, isAuthLoading]);

  // Fungsi untuk handle submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk memberikan review");
      return;
    }

    if (reviewForm.rating === 0) {
      alert("Silakan berikan rating bintang");
      return;
    }

    if (reviewForm.comment.trim() === "") {
      alert("Silakan tulis komentar review");
      return;
    }

    if (reviewForm.comment.length > 128) {
      alert("Komentar maksimal 128 karakter");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product?._id,
          productKey: productKey,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          userId: session?.user?.id,
          userName: session?.user?.name || 'User'
        }),
      });

      if (response.ok) {
        setReviewSubmitted(true);
        setReviewForm({ rating: 0, comment: "" });
        alert("Review berhasil dikirim!");
      } else {
        throw new Error("Gagal mengirim review");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Fungsi untuk handle rating bintang
  const handleRatingClick = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  // Fungsi untuk handle perubahan komentar
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 128) {
      setReviewForm(prev => ({ ...prev, comment: value }));
    }
  };

  if (loading || isAuthLoading) {
    return (
      <Section>
        <div>Memuat detail produk...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <div>Error: {error}</div>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section>
        <div>Produk tidak ditemukan.</div>
      </Section>
    );
  }

  const getActionButton = () => {
    if (!isLoggedIn) {
      return (
        <Link href="/auth/login" passHref>
          <button className={styles.actionButton_secondary}>
            Login untuk Beli
          </button>
        </Link>
      );
    }

    if (product.isOwned) {
      return (
        <Link href={`/user/belajar/${product.name}`} passHref>
          <button className={styles.actionButton_owned}>Mulai Belajar</button>
        </Link>
      );
    }

    return (
      <Link href={`/user/pembelian/checkout/${productKey}`} passHref>
        <button className={styles.actionButton_primary}>Beli Sekarang</button>
      </Link>
    );
  };

  // --- Render Halaman Utama ---
  return (
    <Section className={styles.space}>
      <div className={styles.detailGrid}>
        {/* Kolom Kiri: "Kartu" Gambar */}
        <div className={styles.imageWrapper}>
          <Image
            src={`https://i.ytimg.com/vi/${product.kodePelajaranPertama}/hq720.jpg`}
            alt={product.name}
            width={720}
            height={404}
            layout="responsive"
            className={styles.productImage}
          />
        </div>

        {/* Kolom Kanan: "Kartu" Detail */}
        <div className={styles.detailsWrapper}>

          <div>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <p className={styles.productDescription}>{product.desc}</p>
          </div>

          {/* Box Aksi: "Kartu" di dalam kartu */}
          <div className={styles.actionBox}>
            <span className={styles.productPrice}>Gratis</span>
            <div className={styles.actionButtonContainer}>
              {getActionButton()}
            </div>
          </div>
        </div>
      </div>

      {/* Form Review Sederhana dengan CSS terpisah */}
      <div className={reviewStyles.reviewSection}>
        <h2 className={reviewStyles.reviewTitle}>Berikan Review</h2>
        
        {!isLoggedIn ? (
          <div className={reviewStyles.loginPrompt}>
            <p>Silakan login untuk memberikan review</p>
            <Link href="/auth/login" className={reviewStyles.loginLink}>
              Login Sekarang
            </Link>
          </div>
        ) : reviewSubmitted ? (
          <div className={reviewStyles.successMessage}>
            <p>Terima kasih! Review Anda telah berhasil dikirim.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className={reviewStyles.reviewForm}>
            {/* Rating Bintang */}
            <div className={reviewStyles.ratingSection}>
              <label className={reviewStyles.ratingLabel}>Rating:</label>
              <div className={reviewStyles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${reviewStyles.starButton} ${
                      star <= reviewForm.rating ? reviewStyles.starActive : reviewStyles.starInactive
                    }`}
                    onClick={() => handleRatingClick(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className={reviewStyles.ratingText}>
                {reviewForm.rating > 0 ? `${reviewForm.rating} bintang` : "Pilih rating"}
              </span>
            </div>

            {/* Komentar Sederhana */}
            <div className={reviewStyles.commentSection}>
              <div className={reviewStyles.commentHeader}>
                <label htmlFor="comment" className={reviewStyles.commentLabel}>
                  Komentar:
                </label>
                <span className={reviewStyles.charCount}>
                  {reviewForm.comment.length}/128
                </span>
              </div>
              <textarea
                id="comment"
                value={reviewForm.comment}
                onChange={handleCommentChange}
                placeholder="Tulis komentar singkat Anda... (maks. 128 karakter)"
                className={reviewStyles.commentTextarea}
                rows={3}
                maxLength={128}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingReview || reviewForm.rating === 0 || reviewForm.comment.trim() === ""}
              className={reviewStyles.submitButton}
            >
              {isSubmittingReview ? "Mengirim..." : "Kirim Review"}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}
