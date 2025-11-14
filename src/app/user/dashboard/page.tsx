"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InProgressCourseCard from "@/components/fabio/InProgressCourseCard";
import RecommendedCourseCard from "@/components/fabio/RecommendedCourseCard";
import NoCourseCard from "@/components/fabio/NoCourseCard";
import Section from '@/components/sections';
import styles from '@/styles/fabio/UserDashboard.module.css';

interface DashboardCourse {
  id: string;
  _id?: string;
  name: string;
  shortDesc: string;
  status: string;
  lastWatchedVideoId?: string | null;
  kodePertama?: string;
}

interface InProgressCourse {
  id: string;
  _id?: string;
  name: string;
  shortDesc: string;
  status: string;
  lastWatchedVideoId?: string | null;
  kodePertama?: string;
  progress: number;
  title: string;
  category: string;
  imageUrl: string;
}

interface UserData {
  name: string;
  username: string;
  email: string;
}

interface DashboardData {
  data: {
    ownedProducts: DashboardCourse[];
    latestProducts: DashboardCourse[];
  };
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [inProgressCourses, setInProgressCourses] = useState<InProgressCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<InProgressCourse[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchDashboardData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData = await response.json();
        setUser({
          name: userData.username,
          username: userData.username,
          email: userData.email
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/user/dashboard");
      if (response.ok) {
        const data: DashboardData = await response.json();
        
        const progressCourses: InProgressCourse[] = data.data.ownedProducts.map((course, index) => ({
          ...course,
          id: course.id || course._id || `course-${index}`,
          title: course.name,
          category: getCourseCategory(course.name),
          imageUrl: getCourseImage(course.name),
          progress: course.lastWatchedVideoId ? 50 : 0
        }));
        
        const recommended: InProgressCourse[] = data.data.latestProducts.map((course, index) => ({
          ...course,
          id: course._id || `recommended-${index}`,
          title: course.name,
          category: getCourseCategory(course.name),
          imageUrl: getCourseImage(course.name),
          progress: 0
        }));

        setInProgressCourses(progressCourses);
        setRecommendedCourses(recommended);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseImage = (courseName: string): string => {
    const images: { [key: string]: string } = {
      'HTML': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      'CSS': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
      'Javascript': 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?auto=format&fit=crop&w=800&q=80',
      'JavaScript': 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?auto=format&fit=crop&w=800&q=80'
    };
    return images[courseName] || 'https://images.unsplash.com/photo-1555066930-6e0b7d37e8a1?auto=format&fit=crop&w=800&q=80';
  };

  const getCourseCategory = (courseName: string): string => {
    const categories: { [key: string]: string } = {
      'HTML': 'Web Dasar',
      'CSS': 'Web Dasar', 
      'Javascript': 'Programming',
      'JavaScript': 'Programming'
    };
    return categories[courseName] || 'Programming';
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % recommendedCourses.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + recommendedCourses.length) % recommendedCourses.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        Memuat dashboard...
      </div>
    );
  }

  const currentCourse = recommendedCourses[currentSlide];

  return (
    <Section>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>
          Selamat datang, <span className={styles.userName}>{user?.name || "User"}!</span>
        </h1>
        <p className={styles.welcomeSubtitle}>
          Teruskan progres Anda dan capai tujuan belajar Anda.
        </p>
      </div>

      <div className={styles.quickActions}>
        <div className={styles.actionCard} onClick={() => router.push("/user/profile")}>
          <div className={styles.actionIcon}>👤</div>
          <h3 className={styles.actionTitle}>Profil Saya</h3>
          <p className={styles.actionDescription}>Kelola data pribadi dan pengaturan akun</p>
        </div>
        <div className={styles.actionCard} onClick={() => router.push("/user/belajar")}>
          <div className={styles.actionIcon}>📚</div>
          <h3 className={styles.actionTitle}>Halaman Belajar</h3>
          <p className={styles.actionDescription}>Akses materi dan lanjutkan pembelajaran</p>
        </div>
        <div className={styles.actionCard} onClick={() => router.push("/user/produk")}>
          <div className={styles.actionIcon}>🛍️</div>
          <h3 className={styles.actionTitle}>Produk & Kursus</h3>
          <p className={styles.actionDescription}>Jelajahi kursus dan produk lainnya</p>
        </div>
      </div>

      <div className={styles.equalGrid}>
        <div className={styles.equalCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Kursus Sedang Berjalan</h2>
          </div>
          <div className={styles.coursesList}>
            {inProgressCourses.length > 0 ? (
              inProgressCourses.map((course) => (
                <InProgressCourseCard
                  key={course.id}
                  course={course}
                  router={router}
                />
              ))
            ) : (
              <NoCourseCard router={router} />
            )}
          </div>
        </div>

        <div className={styles.equalCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Rekomendasi Untuk Anda</h2>
          </div>
          <div className={styles.recommendedCarousel}>
            <div className={styles.carouselSlide}>
              <div className={styles.courseImageContainer}>
                <img 
                  src={currentCourse?.imageUrl} 
                  alt={currentCourse?.title}
                  className={styles.courseImage}
                />
                <div className={styles.courseOverlay}>
                  <span className={styles.courseCategory}>{currentCourse?.category}</span>
                  <h3 className={styles.courseTitle}>{currentCourse?.title}</h3>
                  <button 
                    onClick={() => router.push(`/kursus/${currentCourse?.id}`)}
                    className={styles.detailButton}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
            
            <div className={styles.carouselControls}>
              <button 
                onClick={prevSlide}
                className={styles.carouselButton}
              >
                ‹
              </button>
              
              <div className={styles.carouselDots}>
                {recommendedCourses.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`${styles.carouselDot} ${currentSlide === index ? styles.active : ''}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextSlide}
                className={styles.carouselButton}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}