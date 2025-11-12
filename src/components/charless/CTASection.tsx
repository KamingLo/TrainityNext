import React from 'react';
import styles from "@/styles/charless.cta.module.css";

const CTASection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div 
            className={styles.backgroundPattern} 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 18c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6z' stroke='%23fff' stroke-opacity='.1'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
          
          <div className={styles.content}>
            <h2 className={styles.title}>
              Tunggu Apa Lagi?
            </h2>
            <p className={styles.subtitle}>
              Mulai perjalanan belajarmu di dunia digital bersama Trainity hari ini.
            </p>
            <a href="/auth/register" className={styles.button}>
              Buat Akun Gratis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;