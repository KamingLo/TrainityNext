"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "@/styles/michael/reviewUser.module.css";

interface ReviewFormProps {
  productId?: string;
  productKey: string;
  onSubmit: (reviewData: { rating: number; comment: string }) => Promise<void>;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export default function ReviewForm({ productId, productKey, onSubmit }: ReviewFormProps) {
  const { status: authStatus, data: session } = useSession();
  const isLoggedIn = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 0,
    comment: ""
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
      await onSubmit({
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      setReviewSubmitted(true);
      setReviewForm({ rating: 0, comment: "" });
      alert("Review berhasil dikirim!");
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
                    star <= reviewForm.rating ? styles.starActive : styles.starInactive
                  }`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <span className={styles.ratingText}>
              {reviewForm.rating > 0 ? `${reviewForm.rating} bintang` : "Pilih rating"}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmittingReview || reviewForm.rating === 0 || reviewForm.comment.trim() === ""}
            className={styles.submitButton}
          >
            {isSubmittingReview ? "Mengirim..." : "Kirim Review"}
          </button>
        </form>
      )}
    </div>
  );
}