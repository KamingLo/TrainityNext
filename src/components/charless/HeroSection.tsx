"use client"; 

import React from 'react';
import { useSession } from 'next-auth/react';
import { ArrowRight, Terminal } from 'lucide-react';
import styles from "@/styles/charless/hero.module.css"; 

const HeroSection = () => {
  const { status } = useSession();

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBgGradient}></div>
      <div className={styles.heroBgBlur1}></div>
      <div className={styles.heroBgBlur2}></div>

      <div className={styles.heroContainer}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Terminal className={styles.heroBadgeIcon} />
              <span>Platform Belajar Coding Terbaik</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Belajar Gratis,
              <span className={styles.heroTitleGradient}> Mudah Dipahami</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Akses kursus gratis dengan materi berkualitas tinggi, dirancang untuk membekali kamu keterampilan masa depan.
            </p>

            <div className={styles.heroCtaGroup}>
              {status === "unauthenticated" && (
                <a href="/auth/register" className={`${styles.heroCta} ${styles.heroCtaPrimary}`}>
                  Mulai Belajar Sekarang
                  <ArrowRight className={styles.heroCtaIcon} />
                </a>
              )}
              
              <a 
                href="#kursus" 
                className={`
                  ${styles.heroCta} 
                  ${status === "authenticated" ? styles.heroCtaPrimary : styles.heroCtaSecondary}
                `}
              >
                Jelajahi Kursus
              </a>
            </div>

            <div className={styles.heroStats}>
              <div> 
                <div className={styles.heroStatNumber}>100+</div>
                <div className={styles.heroStatLabel}>Video Pembelajaran</div>
              </div>
              <div>
                <div className={styles.heroStatNumber}>1K+</div>
                <div className={styles.heroStatLabel}>Siswa Aktif</div>
              </div>
              <div>
                <div className={styles.heroStatNumber}>4.8</div>
                <div className={styles.heroStatLabel}>Rating</div>
              </div>
            </div>
          </div>

          <div className={styles.heroImageWrapper}>
            <div className={styles.heroImageContainer}>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800" 
                alt="Coding" 
                className={styles.heroImage}
              />
              <div className={styles.heroImageOverlay}></div>
            </div>
            <div className={styles.heroImageBlurEffect}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;