"use client"; 

import React from 'react';
import styles from "@/styles/charless/testimoni.module.css";

const testimonials = [
  {
    name: "Fabio",
    institution: "Universitas Indonesia",
    quote: "Trainity menawarkan pengalaman belajar mendalam tanpa biaya. Pengetahuan dari sini memperkuat ilmu fundamental saya dan sangat berkontribusi pada portofolio saya."
  },
  {
    name: "Joe",
    institution: "Universitas Pelita Harapan",
    quote: "Materi yang diajarkan sangat relevan dan mudah dimengerti karena fokus pada konsep dan disertai video yang membantu. Pengajarnya jelas memiliki skill berkelas!"
  },
  {
    name: "Michael",
    institution: "Universitas Trisakti",
    quote: "Skills yang saya peroleh dari Trainity membuat saya berani melamar ke salah satu perusahaan. Akhirnya, saya berhasil diterima untuk magang menjadi Web Developer!"
  },
  {
    name: "Kaming",
    institution: "Universitas Tarumanagara",
    quote: "Platform ini sangat membantu orang seperti saya untuk memperbarui keterampilan dengan teknologi dan framework web terbaru."
  },
  {
    name: "Charless",
    institution: "Institut Teknologi Surabaya",
    quote: "Konsep-konsep pemrograman di Trainity sangat mudah dipahami dan terapkan. Sulit menemukan penjelasan sebagus ini di tempat lain."
  }
];

const TestimonialsSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Apa Kata Mereka Tentang Kami
          </h2>
          <p className={styles.subtitle}>
            Dengarkan pengalaman nyata dari para pengguna.
          </p>
        </div>

        <div 
          className={styles.slider}
          style={{
            '--width': '420px',
            '--height': '320px',
            '--quantity': testimonials.length
          } as React.CSSProperties}
        >
          <div className={styles.list}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={`${testimonial.name}-${index}`}
                className={styles.item}
                style={{ '--position': index + 1 } as React.CSSProperties}
              >
                <div className={styles.testimonialCard}>
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{testimonial.name}</h3>
                    <p className={styles.userInstitution}>{testimonial.institution}</p>
                  </div>
                  <p className={styles.quote}>
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;