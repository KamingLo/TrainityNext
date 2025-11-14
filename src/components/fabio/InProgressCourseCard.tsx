"use client";

import { Play } from "lucide-react";
import styles from '@/styles/fabio/InProgressCourseCard.module.css';

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

interface RouterLike {
  push: (url: string) => void;
}

interface InProgressCourseCardProps {
  course: InProgressCourse;
  router: RouterLike;
}

export default function InProgressCourseCard({
  course,
  router,
}: InProgressCourseCardProps) {
  return (
    <div className={styles.courseCard}>
      <div className={styles.courseHeader}>
        <img
          src={course.imageUrl}
          alt={course.title}
          className={styles.courseImage}
        />
        <span className={styles.categoryBadge}>
          {course.category}
        </span>
      </div>

      <div className={styles.courseContent}>
        <h3 className={styles.courseTitle}>{course.title}</h3>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Progres</span>
            <span className={styles.progressPercentage}>
              {course.progress}%
            </span>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => router.push(`/kursus/${course.id}`)}
          className={styles.continueButton}
        >
          <Play className={styles.buttonIcon} /> 
          Lanjutkan
        </button>
      </div>
    </div>
  );
}