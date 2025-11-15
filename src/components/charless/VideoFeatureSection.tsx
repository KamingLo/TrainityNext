import React from 'react';
import { Play, Users } from 'lucide-react';
import styles from "@/styles/charless/videofeature.module.css"; 

const VideoFeature = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.grid}>

            <div className={styles.imageWrapper}>
              <img 
                src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQpEjmPJd3QP69EfYZf4BjyeQ0_iQYeKxXaEU9YQlQIKcPMHIvqm8mwm-nCYc-PWfMyqxYMsMhD1P3cXc6WAcU2IyQQ-6aujzSYPyr9laKaOL9NpKg"
                alt="Video Learning" 
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              <h2 className={styles.title}>
                Belajar Lebih Efektif Dengan Video
              </h2>
              
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIconWrapper}>
                    <Play className={styles.featureIcon} />
                  </div>
                  <div className={styles.featureText}>
                    <h3 className={styles.featureTitle}>100+ Video Berkualitas</h3>
                    <p className={styles.featureDescription}>Akses ratusan video yang telah dibuat untuk pemahaman konsep secara menyeluruh.</p>
                  </div>
                </div>

                <div className={styles.featureItem}>
                  <div className={styles.featureIconWrapper}>
                    <Users className={styles.featureIcon} />
                  </div>
                  <div className={styles.featureText}>
                    <h3 className={styles.featureTitle}>Diajar oleh Praktisi Ahli</h3>
                    <p className={styles.featureDescription}>Materi diajarkan oleh praktisi ahli di bidangnya, memastikan relevansi dengan kebutuhan industri.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFeature;