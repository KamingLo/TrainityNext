"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Section from "@/components/sections";
import Link from "next/link";
import styles from "@/styles/michael/dashboard.module.css";

interface Activity {
  userName: string;
  purchasedAt: string;
  productName: string;
}

interface Review {
  productName: string;
  rating: number;
  comment: string;
  userName: string;
  reviewedAt: string;
}

interface DashboardData {
  latestUserActivity: Activity[];
  latestReviews: Review[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data) {
        setDashboardData(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <Section>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Memuat data dashboard...</p>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className={styles.retryButton}>
            Coba Lagi
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Overview aktivitas dan review pengguna</p>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Link href="/admin/review" className={styles.actionButton}>
          <span className={styles.actionIcon}>📝</span>
          Kelola Review
        </Link>
        <Link href="/admin/produk" className={styles.actionButton}>
          <span className={styles.actionIcon}>📦</span>
          Kelola Produk
        </Link>
        <Link href="/admin/users" className={styles.actionButton}>
          <span className={styles.actionIcon}>👥</span>
          Kelola User
        </Link>
      </div>

      {/* Dashboard Content */}
      <div className={styles.dashboardGrid}>
        
        {/* Latest User Activity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrapper}>
              <h2 className={styles.cardTitle}>Aktivitas User Terbaru</h2>
              <span className={styles.cardCount}>
                {dashboardData?.latestUserActivity.length} aktivitas
              </span>
            </div>
            <Link href="/admin/pembelian" className={styles.nextLink}>
              Lihat Semua →
            </Link>
          </div>
          <div className={styles.activityList}>
            {dashboardData?.latestUserActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityUser}>
                  <div className={styles.userAvatar}>
                    {activity.userName.charAt(0)}
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{activity.userName}</span>
                    <span className={styles.productName}>{activity.productName}</span>
                  </div>
                </div>
                <div className={styles.activityTime}>
                  {new Date(activity.purchasedAt).toLocaleDateString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Reviews */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrapper}>
              <h2 className={styles.cardTitle}>Review Terbaru</h2>
              <span className={styles.cardCount}>
                {dashboardData?.latestReviews.length} review
              </span>
            </div>
            <Link href="/admin/review" className={styles.nextLink}>
              Lihat Semua →
            </Link>
          </div>
          <div className={styles.reviewList}>
            {dashboardData?.latestReviews.map((review, index) => (
              <div key={index} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.userAvatar}>
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <span className={styles.userName}>{review.userName}</span>
                      <div className={styles.rating}>
                        {"⭐".repeat(review.rating)}
                        <span className={styles.ratingText}>({review.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  <span className={styles.reviewTime}>
                    {new Date(review.reviewedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                <span className={styles.productName}>{review.productName}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
}