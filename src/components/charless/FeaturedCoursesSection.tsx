import React from 'react';
import { Star } from 'lucide-react';
import styles from "@/styles/charless.featuredcourse.module.css";

const featuredCourses = [
  {
    id: 1,
    title: "HTML & CSS Fundamental",
    description: "Pelajari dasar-dasar web development dari nol hingga mahir",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
    level: "Pemula",
    rating: 4.8
  },
  {
    id: 2,
    title: "JavaScript Modern",
    description: "Master JavaScript ES6+ untuk pengembangan web modern",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500",
    level: "Menengah",
    rating: 4.9
  },
  {
    id: 3,
    title: "React untuk Pemula",
    description: "Bangun aplikasi web interaktif dengan React.js",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
    level: "Menengah",
    rating: 4.7
  }
];

const FeaturedCourses = () => {
  return (
    <section id="kursus" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Kursus Unggulan
          </h2>
        </div>

        <div className={styles.grid}>
          {featuredCourses.map((course) => (
            <div 
              key={course.id}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className={styles.thumbnail}
                />
                <div className={styles.imageOverlay}></div>
              </div>
              
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>
                  {course.title}
                </h3>
                <p className={styles.cardDescription}>{course.description}</p>
                
                <div className={styles.footer}>
                  <span className={styles.levelBadge}>
                    {course.level}
                  </span>
                  <div className={styles.rating}>
                    <Star className={styles.starIcon} />
                    <span className={styles.ratingText}>{course.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.buttonWrapper}>
          <button className={styles.viewAllButton}>
            Lihat Semua Kursus
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;