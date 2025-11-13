"use client";

import Section from "@/components/sections";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/michael/reviewAdmin.module.css";

interface Review {
  _id: string;
  userName: string;
  userEmail: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: string;
}

export default function AdminReview() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isLoggedIn) {
      fetchReviews();
    }
  }, [isLoggedIn, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/review`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch reviews:", data.error);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm(
      "⚠️ PERINGATAN!\n\nTindakan ini tidak dapat dibatalkan. Review akan dihapus secara permanen.\n\nApakah Anda yakin ingin menghapus review ini?"
    );
    
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/review/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh reviews after deletion
        fetchReviews();
        alert("Review berhasil dihapus!");
      } else {
        const data = await response.json();
        alert("Gagal menghapus review: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Terjadi kesalahan saat menghapus review");
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.errorText}>Anda belum login.</p>
      </div>
    );
  }

  return (
    <Section>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Review</h1>
        <p className={styles.subtitle}>Kelola review dan rating dari pengguna</p>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionContent}>
          <div>
            <h2 className={styles.actionTitle}>All Review ({reviews.length})</h2>
            <p className={styles.actionSubtitle}>Ratings and feedback from users</p>
          </div>
          <div className={styles.actionButtons}>
            <Link href="/admin/dashboard" className={styles.backButton}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className={styles.reviewList}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Memuat reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Tidak ada review ditemukan</p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <div key={review._id} className={styles.reviewCard}>
                {/* Review Header */}
                <div className={styles.reviewHeader}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      <span>{review.userName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className={styles.userName}>{review.userName}</h3>
                      <p className={styles.userEmail}>{review.userEmail}</p>
                    </div>
                  </div>
                  
                  <div className={styles.reviewMeta}>
                    <div className={styles.rating}>
                      <span className={styles.stars}>
                        {"⭐".repeat(review.rating)}
                      </span>
                      <span className={styles.ratingText}>({review.rating}/5)</span>
                    </div>
                    
                    <span className={`${styles.status} ${styles[review.status]}`}>
                      {review.status}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <p className={styles.productName}>{review.productName}</p>

                {/* Review Comment */}
                <div className={styles.comment}>
                  <p>{review.comment}</p>
                </div>

                {/* Review Footer */}
                <div className={styles.reviewFooter}>
                  <div className={styles.date}>
                    Posted on {new Date(review.createdAt).toLocaleDateString('id-ID')}
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteReview(review._id)}
                    className={styles.deleteButton}
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Section>
  );
}