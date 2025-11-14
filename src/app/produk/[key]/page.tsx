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
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  productId?: {
    _id: string;
    name: string;
  };
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
  const [userReviews, setUserReviews] = useState<Review[]>([]); // State untuk histori review user

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
        // Fetch histori review user
        await fetchUserReviews();
      } catch (err: any) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [productKey, isAuthLoading]);

  // Fungsi untuk fetch reviews produk
  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/reviews?productId=${productId}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fungsi untuk fetch histori review user
  const fetchUserReviews = async () => {
    if (!isLoggedIn) return;
    
    try {
      const response = await fetch(`/api/user/review?productKey=${productKey}`);
      if (response.ok) {
        const userReviewsData = await response.json();
        setUserReviews(userReviewsData);
      }
    } catch (err: any) {
      console.error("Gagal mengambil histori review:", err.message);
    }
  };

  // Fungsi untuk handle submit review
  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    const response = await fetch('/api/user/review', {
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
      await fetchUserReviews(); // Refresh histori review user juga
    }
  };

  // Komponen untuk menampilkan histori review user
  const UserReviewHistory = () => {
    if (!isLoggedIn) {
      return (
        <div className={reviewStyles.reviewHistorySection}>
          <h3 className={reviewStyles.sectionTitle}>Histori Review Anda</h3>
          <p>Silakan login untuk melihat histori review Anda.</p>
        </div>
      );
    }

    if (userReviews.length === 0) {
      return (
        <div className={reviewStyles.reviewHistorySection}>
          <h3 className={reviewStyles.sectionTitle}>Histori Review Anda</h3>
          <p>Anda belum memberikan review untuk produk ini.</p>
        </div>
      );
    }

    return (
      <div className={reviewStyles.reviewHistorySection}>
        <h3 className={reviewStyles.sectionTitle}>Review Anda</h3>
        <div className={reviewStyles.userReviewsList}>
          {userReviews.map((review) => (
            <div key={review._id} className={reviewStyles.userReviewItem}>
              <div className={reviewStyles.reviewHeader}>
                <div className={reviewStyles.rating}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  <span className={reviewStyles.ratingNumber}>({review.rating}/5)</span>
                </div>
                <span className={reviewStyles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>
              <p className={reviewStyles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    );
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

      {/* Tambahkan bagian histori review di sini */}
      <UserReviewHistory />

      {/* Form review */}
      <ReviewForm 
        productKey={productKey}
        onSubmitReview={handleSubmitReview}
        userHasReviewed={userReviews.length > 0}
      />
    </Section>
  );
}