"use client";

import { useState, useEffect } from "react";
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

export default function DetailProdukPage() {
  const { status: authStatus, data: session } = useSession();
  const isLoggedIn = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const params = useParams();
  const productKey = params.key as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

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
        await fetchReviews(productData._id);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [productKey, isAuthLoading]);

  // Fungsi untuk fetch reviews
  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/reviews?productId=${productId}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fungsi untuk handle submit review
  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: product?._id,
        productKey: productKey,
        rating: reviewData.rating,
        comment: reviewData.comment,
        userId: session?.user?.id,
        userName: session?.user?.name || 'User'
      }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengirim review");
    }

    // Refresh reviews setelah submit berhasil
    if (product?._id) {
      await fetchReviews(product._id);
    }
  };

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

  if (loading || isAuthLoading) {
    return <Section><div>Memuat detail produk...</div></Section>;
  }

  if (error) {
    return <Section><div>Error: {error}</div></Section>;
  }

  if (!product) {
    return <Section><div>Produk tidak ditemukan.</div></Section>;
  }

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

      {/* Section Review dengan Histori dan Form */}
      <div className={reviewStyles.reviewContainer}>
        
        {/* Histori Review */}
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
                      {new Date(review.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className={reviewStyles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Review */}
        <ReviewForm 
          productId={product._id}
          productKey={productKey}
          onSubmit={handleSubmitReview}
        />
      </div>
    </Section>
  );
}
