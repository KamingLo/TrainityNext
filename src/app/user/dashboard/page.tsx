"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InProgressCourseCard from "@/components/fabio/InProgressCourseCard";
import RecommendedCourseCard from "@/components/fabio/RecommendedCourseCard";
import NoCourseCard from "@/components/fabio/NoCourseCard";
import Section from '@/components/sections';
import styles from '@/styles/fabio/UserDashboard.module.css';

interface Course {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

interface InProgressCourse extends Course {
  progress: number;
}

interface UserData {
  name: string;
  username: string;
  email: string;
}

export default function UserDashboardPage() {
  const router = useRouter();

  const [inProgressCourses, setInProgressCourses] = useState<InProgressCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    loadCoursesData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData = await response.json();
        setUser({
          name: userData.username, // atau sesuaikan dengan field yang ada
          username: userData.username,
          email: userData.email
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const loadCoursesData = () => {
    const coursesData: InProgressCourse[] = [
      {
        id: 1,
        title: "React untuk Pemula",
        progress: 30,
        category: "Frontend",
        imageUrl: "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        title: "JavaScript Fundamentals",
        progress: 75,
        category: "Programming",
        imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
      },
    ];

    const recommendedData: Course[] = [
      {
        id: 3,
        title: "Node.js & Express",
        category: "Backend",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        title: "UI/UX Design with Figma",
        category: "Desain",
        imageUrl: "https://images.unsplash.com/photo-1607083205563-3eacb915b1c5?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 5,
        title: "Dasar-Dasar HTML & CSS",
        category: "Web Dasar",
        imageUrl: "https://images.unsplash.com/photo-1555066930-6e0b7d37e8a1?auto=format&fit=crop&w=800&q=80",
      },
    ];

    setInProgressCourses(coursesData);
    setRecommendedCourses(recommendedData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        Memuat dashboard...
      </div>
    );
  }

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
          <div className={styles.recommendedList}>
            {recommendedCourses.map((course) => (
              <RecommendedCourseCard
                key={course.id}
                course={course}
                router={router}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}