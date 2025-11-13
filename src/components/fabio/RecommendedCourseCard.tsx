"use client";

import { BookOpen } from "lucide-react";
import styles from '@/styles/fabio/RecommendedCourseCard.module.css';

interface Course {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

interface RouterLike {
  push: (url: string) => void;
}

interface RecommendedCourseCardProps {
  course: Course;
  router: RouterLike;
}

export default function RecommendedCourseCard({
  course,
  router,
}: RecommendedCourseCardProps) {
  return (
    <div className={styles.recommendedCard}>
      <div className={styles.recommendedHeader}>
        <img
          src={course.imageUrl}
          alt={course.title}
          className={styles.recommendedImage}
        />
        <span className={styles.recommendedCategory}>
          {course.category}
        </span>
      </div>

      <div className={styles.recommendedContent}>
        <h3 className={styles.recommendedTitle}>
          {course.title}
        </h3>

        <button
          onClick={() => router.push(`/kursus/${course.id}`)}
          className={styles.detailButton}
        >
          <BookOpen className={styles.buttonIcon} /> Lihat Detail
        </button>
      </div>
    </div>
  );
}