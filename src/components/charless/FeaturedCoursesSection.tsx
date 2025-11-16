"use client"; 

import React, { useState, useEffect } from 'react'; 
import styles from "@/styles/charless/featuredcourse.module.css";
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  shortDesc: string;
  kodePelajaranPertama: string;
}

const featuredCourseNames = [
  "HTML",
  "NodeJS",
  "Laravel 8"
];

const FeaturedCourses = () => {
  const [courses, setCourses] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError(null);  
      try {
        const res = await fetch("/api/user/product"); 
        
        if (!res.ok) {
          throw new Error("Gagal mengambil data kursus.");
        }
        
        const allProducts: Product[] = await res.json();
        const filteredCourses = allProducts.filter(product => 
          featuredCourseNames.includes(product.name)
        );

        setCourses(filteredCourses); 

      } catch (err: AppError) {
        if (err instanceof Error) {
          setError(err.message); 
        } else {
          setError("Terjadi kesalahan yang tidak diketahui."); 
        }
        setCourses([]); 
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []); 

  if (loading) {
    return (
      <section id="kursus" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Kursus Unggulan</h2>
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat kursus...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="kursus" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Kursus Unggulan</h2>
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>
            Error: {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="kursus" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Kursus Unggulan
          </h2>
        </div>

        <div className={styles.grid}>
          {courses.map((course) => (
            <Link 
              key={course._id} 
              href={`/produk/${course.name}`} 
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                
                <Image 
                  src={`https://i.ytimg.com/vi/${course.kodePelajaranPertama}/hq720.jpg`} 
                  alt={course.name} 
                  className={styles.thumbnail}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                <div className={styles.imageOverlay}></div>
              </div>
              
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>
                  {course.name} 
                </h3>
                <p className={styles.cardDescription}>
                  {course.shortDesc}
                </p>
              </div>
            </Link> 
          ))}
        </div>

        {!loading && courses.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            {error ? 'Gagal memuat kursus.' : 'Tidak ada kursus unggulan yang tersedia.'}
          </p>
        )}

          <div className={styles.buttonWrapper}>
          <Link 
            href="/produk" 
            className={styles.viewAllButton}
          >
            Lihat Semua Kursus
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;