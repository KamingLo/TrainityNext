import React from 'react';
import { CheckCircle, Clock, Users } from 'lucide-react';
import styles from "@/styles/charless/whychooseus.module.css"; 

const WhyChooseUs = () => {
  const advantages = [
    {
      icon: <CheckCircle className={styles.icon} />, 
      title: "Kurikulum Terstruktur",
      description: "Materi disusun secara sistematis dari dasar hingga mahir, memastikan Anda belajar dengan alur yang jelas dan efektif."
    },
    {
      icon: <Clock className={styles.icon} />, 
      title: "Akses Kapan Saja",
      description: "Belajar sesuai dengan kecepatan dan jadwal Anda sendiri. Semua materi kursus dapat diakses selamanya tanpa batas waktu."
    },
    {
      icon: <Users className={styles.icon} />,
      title: "Diajar oleh Praktisi Ahli",
      description: "Belajar langsung dari profesional industri yang memiliki pengalaman nyata di bidangnya masing-masing."
    }
  ];

  return (
    <section id="mengapa" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Mengapa Memilih Trainity?
          </h2>
          <p className={styles.subtitle}>
            Kami menyediakan platform terbaik untuk membantu Anda menjadi developer andal.
          </p>
        </div>

        <div className={styles.grid}>
          {advantages.map((advantage, index) => (
            <div 
              key={index}
              className={styles.card}
            >
              <div className={styles.iconWrapper}>
                {advantage.icon}
              </div>
              <h3 className={styles.cardTitle}>{advantage.title}</h3>
              <p className={styles.cardDescription}>{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;