"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
// Pastikan path CSS ini sesuai dengan struktur folder Anda
import styles from "@/styles/michael/reviewUser.module.css"; 

interface ReviewFormProps {
  productKey: string; // Kunci utama untuk API mencari produk
  onSuccess?: () => void; // Callback opsional untuk refresh data di parent
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export default function ReviewForm({ productKey, onSuccess }: ReviewFormProps) {
  const { status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 0,
    comment: "",
  });
  
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fungsi untuk handle submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

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

    setIsSubmittingReview(true);

    try {
      // Panggil API yang sudah dibuat
      const res = await fetch("/api/user/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productKey: productKey, // Mengirim key produk (nama/slug)
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          // userId tidak dikirim manual, diambil dari session di server
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim review");
      }

      // Jika sukses
      setReviewSubmitted(true);
      setReviewForm({ rating: 0, comment: "" });
      
      // Panggil callback parent jika ada (misal untuk reload list review)
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Review Error:", error);
      setErrorMessage(error.message);
      alert(error.message); // Tampilkan alert error
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Fungsi untuk handle rating bintang
  const handleRatingClick = (rating: number) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  // Fungsi untuk handle perubahan komentar
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 128) {
      setReviewForm((prev) => ({ ...prev, comment: value }));
    }
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.reviewSection}>
      <h2 className={styles.reviewTitle}>Berikan Review</h2>

      {!isLoggedIn ? (
        <div className={styles.loginPrompt}>
          <p>Silakan login untuk memberikan review</p>
          <Link href="/auth/login" className={styles.loginLink}>
            Login Sekarang
          </Link>
        </div>
      ) : reviewSubmitted ? (
        <div className={styles.successMessage}>
          <p>Terima kasih! Review Anda telah berhasil dikirim.</p>
          {/* Tombol opsional jika ingin review lagi (biasanya tidak perlu jika single review per user) */}
        </div>
      ) : (
        <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
          {/* Rating Bintang */}
          <div className={styles.ratingSection}>
            <label className={styles.ratingLabel}>Rating:</label>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starButton} ${
                    star <= reviewForm.rating
                      ? styles.starActive
                      : styles.starInactive
                  }`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <span className={styles.ratingText}>
              {reviewForm.rating > 0
                ? `${reviewForm.rating} bintang`
                : "Pilih rating"}
            </span>
          </div>

          {/* Komentar Sederhana */}
          <div className={styles.commentSection}>
            <div className={styles.commentHeader}>
              <label htmlFor="comment" className={styles.commentLabel}>
                Komentar:
              </label>
              <span className={styles.charCount}>
                {reviewForm.comment.length}/128
              </span>
            </div>
            <textarea
              id="comment"
              value={reviewForm.comment}
              onChange={handleCommentChange}
              placeholder="Tulis komentar singkat Anda... (maks. 128 karakter)"
              className={styles.commentTextarea}
              rows={3}
              maxLength={128}
              required
            />
          </div>
            
          {/* Error Message Display (Optional) */}
          {errorMessage && (
            <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '10px' }}>
                {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isSubmittingReview ||
              reviewForm.rating === 0 ||
              reviewForm.comment.trim() === ""
            }
            className={styles.submitButton}
          >
            {isSubmittingReview ? "Mengirim..." : "Kirim Review"}
          </button>
        </form>
      )}
    </div>
  );
}