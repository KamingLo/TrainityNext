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
  const [totalItems, setTotalItems] = useState(0);
  
  // State untuk modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    if (isLoggedIn) {
      fetchReviews();
    }
  }, [isLoggedIn, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/review?page=${currentPage}&limit=${itemsPerPage}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const transformedReviews = data.data.map((review: any) => ({
          _id: review._id,
          userName: review.userId?.name || 'Unknown User',
          userEmail: review.userId?.email || 'No Email',
          productName: review.productId?.name || 'Unknown Product',
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          status: review.status || 'approved'
        }));
        
        setReviews(transformedReviews);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || transformedReviews.length);
      } else {
        console.error("Invalid response format:", data);
        setReviews([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (review: Review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
    setDeleteLoading(false);
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/admin/review?id=${reviewToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchReviews();
        closeDeleteModal();
        setShowSuccessModal(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Gagal menghapus review");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setErrorMessage("Terjadi kesalahan saat menghapus review");
      setShowErrorModal(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Modal Components
  const DeleteConfirmationModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>⚠️ Konfirmasi Hapus Review</h3>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.warningText}>
            Tindakan ini tidak dapat dibatalkan. Review akan dihapus secara permanen.
          </p>
          
          {reviewToDelete && (
            <div className={styles.reviewPreview}>
              <div className={styles.previewHeader}>
                <strong>User:</strong> {reviewToDelete.userName}
              </div>
              <div className={styles.previewItem}>
                <strong>Produk:</strong> {reviewToDelete.productName}
              </div>
              <div className={styles.previewItem}>
                <strong>Rating:</strong> {"⭐".repeat(reviewToDelete.rating)}
              </div>
              <div className={styles.previewItem}>
                <strong>Komentar:</strong> 
                <p className={styles.previewComment}>"{reviewToDelete.comment}"</p>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.modalFooter}>
          <button
            onClick={closeDeleteModal}
            className={styles.cancelButton}
            disabled={deleteLoading}
          >
            Batal
          </button>
          <button
            onClick={handleDeleteReview}
            className={styles.confirmDeleteButton}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <div className={styles.spinnerSmall}></div>
                Menghapus...
              </>
            ) : (
              'Ya, Hapus Review'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const SuccessModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitleSuccess}>✅ Berhasil</h3>
        </div>
        
        <div className={styles.modalBody}>
          <p>Review berhasil dihapus!</p>
        </div>
        
        <div className={styles.modalFooter}>
          <button
            onClick={() => setShowSuccessModal(false)}
            className={styles.okButton}
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );

  const ErrorModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitleError}>❌ Error</h3>
        </div>
        
        <div className={styles.modalBody}>
          <p>{errorMessage}</p>
        </div>
        
        <div className={styles.modalFooter}>
          <button
            onClick={() => setShowErrorModal(false)}
            className={styles.okButton}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );

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
        <Link href="/auth/login" className={styles.loginLink}>
          Login di sini
        </Link>
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
            <h2 className={styles.actionTitle}>
              All Review ({totalItems})
            </h2>
            <p className={styles.actionSubtitle}>
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} reviews
            </p>
          </div>
          <div className={styles.actionButtons}>
            <Link href="/admin/dashboard" className={styles.backButton}>
              ← Back to Dashboard
            </Link>
            <button 
              onClick={fetchReviews}
              className={styles.backButton}
              disabled={loading}
            >
              🔄 Refresh
            </button>
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
            <button 
              onClick={fetchReviews}
              className={styles.retryButton}
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <div key={review._id} className={styles.reviewCard}>
                {/* Review Header */}
                <div className={styles.reviewHeader}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      <span>{review.userName.charAt(0).toUpperCase()}</span>
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
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span className={styles.ratingText}>({review.rating}/5)</span>
                    </div>
                    
                    <span className={`${styles.status} ${styles[review.status]}`}>
                      {review.status === 'approved' ? 'Disetujui' : 
                       review.status === 'pending' ? 'Menunggu' : 
                       review.status === 'rejected' ? 'Ditolak' : review.status}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className={styles.productInfo}>
                  <span className={styles.productLabel}>Produk:</span>
                  <span className={styles.productName}>{review.productName}</span>
                </div>

                {/* Review Comment */}
                <div className={styles.comment}>
                  <p>{review.comment}</p>
                </div>

                {/* Review Footer */}
                <div className={styles.reviewFooter}>
                  <div className={styles.date}>
                    Diposting pada {new Date(review.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  
                  <button 
                    onClick={() => openDeleteModal(review)}
                    className={styles.deleteButton}
                    disabled={loading}
                  >
                    Hapus Review
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  ⏮️ First
                </button>
                
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  ◀️ Previous
                </button>
                
                <div className={styles.pageNumbers}>
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`${styles.pageButton} ${
                        currentPage === page ? styles.activePage : ''
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  Next ▶️
                </button>
                
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  Last ⏭️
                </button>
                
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showDeleteModal && <DeleteConfirmationModal />}
      {showSuccessModal && <SuccessModal />}
      {showErrorModal && <ErrorModal />}
    </Section>
  );
}