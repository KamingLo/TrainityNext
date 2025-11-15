import React from 'react';
import styles from "@/styles/charless/partnership.module.css"; 

const PartnershipSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.grid}>
            
            <div className={styles.content}>
              <span className={styles.tagline}>
                Kolaborasi Spesial
              </span>
              <h2 className={styles.title}>
                Kurikulum Didukung Penuh oleh Web Programming UNPAS
              </h2>
              <p className={styles.description}>
                Kami bangga dapat bekerja sama dengan Sandhika Galih dari Web Programming UNPAS. Kolaborasi ini memastikan bahwa kurikulum kami relevan, mendalam, dan sesuai dengan standar industri terbaik.
              </p>
              <button className={styles.button}>
                Jelajahi Kurikulum
              </button>
            </div>

            <div className={styles.imageColumn}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageBlur}></div>
                <div className={styles.imageFrame}>
                  <img 
                    src="/homepage/sandhika.png" 
                    alt="Sandhika Galih"
                    className={styles.image}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;