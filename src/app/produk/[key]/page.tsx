"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Section from "@/components/sections";
import Link from "next/link";
import Image from "next/image";
import ReviewForm from "@/components/michael/reviewForm";

import styles from "@/styles/kaming/publicProdukDetail.module.css";
import reviewStyles from "@/styles/michael/reviewUser.module.css";

interface Product {
  _id: string;
  name: string;
  desc: string;
  shortDesc: string;
  kodePelajaranPertama: string;
  isOwned: boolean;
}

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ApiReview {
  _id: string;
  userId?: {
    username?: string;
  } | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function DetailProdukPage() {
  const { status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const params = useParams();
  const productKey = params.key as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fungsi untuk fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      // Menggunakan productKey karena API endpoint menerima productKey
      // Tidak pakai limit untuk fetch semua review, scroll akan menampilkan 3 pertama
      // Tambahkan timestamp untuk cache-busting
      const timestamp = Date.now();
      const response = await fetch(`/api/user/review?productKey=${productKey}&_t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data: ApiReview[] = await response.json();
        // Transform data dari API format ke Review format
        const transformedReviews: Review[] = data.map((review: ApiReview) => {
          // Ambil username dari userId yang di-populate
          let userName = 'Pengguna';
          
          // Handle berbagai format userId dari API
          if (review.userId) {
            if (typeof review.userId === 'object' && review.userId !== null && !Array.isArray(review.userId)) {
              // Jika userId adalah object (sudah di-populate)
              const userIdObj = review.userId as { username?: string };
              userName = userIdObj.username || 'Pengguna';
            } else if (typeof review.userId === 'string') {
              // Jika userId masih string (belum di-populate), tetap pakai default
              userName = 'Pengguna';
            }
          }
          
          return {
            _id: review._id,
            userName: userName,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
          };
        });
        
        // Sort berdasarkan createdAt (terbaru di atas, terlama di bawah)
        // Karena sekarang semua review adalah baru (tidak ada update), gunakan createdAt saja
        transformedReviews.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // Terbaru di atas (descending)
        });
        
        // Debug: log untuk memastikan semua review ada
        console.log('Fetched reviews:', transformedReviews.length, 'reviews');
        console.log('Reviews data:', transformedReviews);
        
        setReviews(transformedReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [productKey]);

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
        // Fetch reviews setelah product didapatkan
        await fetchReviews();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [productKey, isAuthLoading, fetchReviews]);

  // Callback untuk refresh reviews setelah submit berhasil
  const handleReviewSuccess = useCallback(async () => {
    await fetchReviews();
  }, [fetchReviews]);

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

    if (product?.isOwned) {
      return (
        <Link href={`/user/belajar/${product.name}`} passHref>
          <button className={styles.actionButton_owned}>
            Mulai Belajar
          </button>
        </Link>
      );
    }

    return (
      <Link href={`/user/pembelian/checkout/${productKey}`} passHref>
        <button className={styles.actionButton_primary}>
          Beli Sekarang
        </button>
      </Link>
    );
  };

  if (loading || isAuthLoading) {
    return <Section><div>Memuat detail produk...</div></Section>;
  }

  if (error) {
    return <Section><div>Error: {error}</div></Section>;
  }

  if (!product) {
    return <Section><div>Produk tidak ditemukan.</div></Section>;
  }

  return (
    <Section className={styles.space}>
      <div className={styles.detailGrid}>

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

        <div className={styles.detailsWrapper}>

          <div>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <p className={styles.productDescription}>{product.desc}</p>
          </div>

          <div className={styles.actionBox}>
            <span className={styles.productPrice}>Gratis</span>
            <div className={styles.actionButtonContainer}>
              {getActionButton()}
            </div>
          </div>

        </div>
      </div>

      <div className={reviewStyles.reviewContainer}>
        <div className={reviewStyles.reviewHistory}>
          <h2 className={reviewStyles.historyTitle}>Review dari Pengguna</h2>
          
          {reviewsLoading ? (
            <div className={reviewStyles.loadingState}>
              <p>Memuat review...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className={reviewStyles.emptyState}>
              <p>Belum ada review untuk produk ini</p>
            </div>
          ) : (
            <div className={reviewStyles.reviewsList}>
              {reviews.map((review) => (
                <div key={review._id} className={reviewStyles.reviewItem}>
                  <div className={reviewStyles.reviewHeader}>
                    <div className={reviewStyles.userAvatar}>
                      <span>{review.userName.charAt(0)}</span>
                    </div>
                    <div className={reviewStyles.userInfo}>
                      <h4 className={reviewStyles.reviewUserName}>{review.userName}</h4>
                      <div className={reviewStyles.reviewRating}>
                        <span className={reviewStyles.stars}>
                          {"⭐".repeat(review.rating)}
                        </span>
                        <span className={reviewStyles.ratingText}>({review.rating}/5)</span>
                      </div>
                    </div>
                    <span className={reviewStyles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className={reviewStyles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <ReviewForm 
          productKey={productKey}
          onSuccess={handleReviewSuccess}
        />
      </div>
    </Section>
  );
}