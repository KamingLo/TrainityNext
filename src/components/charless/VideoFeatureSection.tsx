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
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600" 
                alt="Video Learning" 
                className={styles.image}
              />
              <div className={styles.overlay}>
                <div className={styles.playButton}>
                  <Play className={styles.playIcon} />
                </div>
              </div>
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