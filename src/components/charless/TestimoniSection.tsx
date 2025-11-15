"use client"

import React, { useEffect, useRef } from 'react';
import styles from "@/styles/charless/testimoni.module.css";

const testimonials = [
  {
    name: "Fabio",
    institution: "Universitas Indonesia",
    quote: "Trainity menawarkan pengalaman belajar mendalam tanpa biaya. Pengetahuan dari sini memperkuat ilmu fundamental saya dan sangat berkontribusi pada portofolio profesional yang tengah saya bangun untuk karier di dunia teknologi."
  },
  {
    name: "Joe",
    institution: "Universitas Pelita Harapan",
    quote: "Materi yang diajarkan sangat relevan dan mudah dimengerti karena fokus pada konsep dan disertai video yang membantu. Pengajarnya jelas memiliki skill berkelas!"
  },
  {
    name: "Michael",
    institution: "Universitas Trisakti",
    quote: "Skills yang saya peroleh dari Trainity membuat saya berani melamar ke salah satu startup ternama. Akhirnya, saya berhasil diterima sebagai Junior Web Developer!"
  },
  {
    name: "Kaming",
    institution: "Universitas Tarumanagara",
    quote: "Platform ini sangat membantu profesional berpengalaman seperti saya untuk memperbarui keterampilan dengan teknologi dan framework web terbaru."
  },
  {
    name: "Charless",
    institution: "Institut Teknologi Surabaya",
    quote: "Konsep-konsep pemrograman di Trainity sangat mudah dipahami dan terapkan. Sulit menemukan penjelasan sebagus ini di tempat lain, bahkan di kampus sekalipun."
  }
];

const Testimonials = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const scroller = scrollContainerRef.current;

    if (scroller && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scroller.setAttribute("data-animated", "true");
    }
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Kata Mereka yang Belajar Bersama Kami
        </h2>
      </div>

      <div className={styles.scrollWrapper}>
        <div 
          className={styles.scrollContainer}
          ref={scrollContainerRef}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div 
              key={index}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className={styles.name}>{testimonial.name}</div>
                  <div className={styles.institution}>{testimonial.institution}</div>
                </div>
              </div>
              <p className={styles.quote}>{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;