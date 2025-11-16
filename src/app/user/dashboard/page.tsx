"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import InProgressCourseCard from "@/components/fabio/InProgressCourseCard";
import RecommendedCourseCard from "@/components/fabio/RecommendedCourseCard";
import NoCourseCard from "@/components/fabio/NoCourseCard";
import Section from '@/components/sections';
import styles from '@/styles/fabio/UserDashboard.module.css';
import Link from "next/link";

interface DashboardCourse {
  id: string;
  _id?: string;
  name: string;
  shortDesc: string;
  status: string;
  lastWatchedVideoId?: string | null;
  kodePertama?: string;
  progressPercentage?: number;
  video?: Array<{ kodePelajaran?: string }>;
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


  
    const fetchUserData = useCallback(async () => {
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
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await fetch("/api/user/dashboard");
            if (response.ok) {
            const data: DashboardData = await response.json();
            
            const progressCourses: InProgressCourse[] = data.data.ownedProducts.map((course, index) => ({
                ...course,
                id: course.id || course._id || `course-${index}`,
                title: course.name,
                category: course.name,
                imageUrl: getCourseImage(course),
                progress: course.progressPercentage || 0
            }));
            
            const recommended: InProgressCourse[] = data.data.latestProducts.map((course, index) => ({
                ...course,
                id: course._id || `recommended-${index}`,
                title: course.name,
                category: course.name,
                imageUrl: getCourseImage(course),
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
    }, []); 

    useEffect(() => {
        fetchUserData();
        fetchDashboardData();
    }, [fetchUserData, fetchDashboardData]);

const getCourseImage = (course: DashboardCourse): string => {
    const videoCode = course.kodePertama || course.video?.[0]?.kodePelajaran;
    return videoCode 
    ? `https://i.ytimg.com/vi/${videoCode}/hqdefault.jpg`
    : 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=No+Image';
  };

  const nextSlide = () => {
    if (recommendedCourses.length > 0) {
      setCurrentSlide(prev => (prev + 1) % recommendedCourses.length);
    }
  };

  const prevSlide = () => {
    if (recommendedCourses.length > 0) {
      setCurrentSlide(prev => (prev - 1 + recommendedCourses.length) % recommendedCourses.length);
    }
  };

  const goToSlide = (index: number) => {
    if (recommendedCourses.length > 0) {
      setCurrentSlide(index);
    }
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
        <div className={styles.actionCard} onClick={() => router.push("/produk")}>
          <div className={styles.actionIcon}>🛍️</div>
          <h3 className={styles.actionTitle}>Produk & Kursus</h3>
          <p className={styles.actionDescription}>Jelajahi kursus dan produk lainnya</p>
        </div>
      </div>

      <div className={styles.equalGrid}>
        <div className={styles.equalCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Kursus Sedang Berjalan</h2>
              <Link href={`/user/belajar`} style={{textDecoration: "none"}}> 
                <p className={styles.linkButton}>
                Belajar Semua 
              </p>
            </Link>
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
            {recommendedCourses.length > 0 ? (
              <>
                <div className={styles.carouselSlide}>
                  <RecommendedCourseCard
                    course={{
                      id: parseInt(currentCourse.id) || 0,
                      title: currentCourse.title,
                      category: currentCourse.category,
                      imageUrl: currentCourse.imageUrl
                    }}
                    router={router}
                  />
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
              </>
            ) : (
              <div className={styles.noRecommendation}>
                <p>Tidak ada rekomendasi kursus saat ini</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}