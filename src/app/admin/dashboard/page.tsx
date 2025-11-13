import Link from 'next/link';
import styles from '../../../styles/michael/dashboard.module.css';
import Section from '@/components/sections';

export default function DashboardPage() {
  return (
    <Section>
      {/* Quick Actions */}
      <div className={styles.quickActionsCard}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionButtons}>
          <Link href="/admin/produk" className={`${styles.actionBtn} ${styles.productBtn}`}>
            <span className={styles.actionIcon}>📦</span>
            Kelola Produk
          </Link>
          <Link href="/belajar" className={`${styles.actionBtn} ${styles.learnBtn}`}>
            <span className={styles.actionIcon}>📚</span>
            Materi Belajar
          </Link>
          <Link href="/admin" className={`${styles.actionBtn} ${styles.adminBtn}`}>
            <span className={styles.actionIcon}>⚙️</span>
            Admin Panel
          </Link>
        </div>
      </div>

      {/* Main Content Grid - 2 Columns Sejajar */}
      <div className={styles.equalGrid}>
        {/* Card 1: Review Terbaru */}
        <div className={styles.equalCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Review Terbaru</h3>
            <Link href="/admin/review" className={styles.viewAllLink}>
              Lihat Semua
            </Link>
          </div>
          <div className={styles.reviewsList}>
            <div className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.userAvatar}>
                  <span className={styles.avatarText}>U1</span>
                </div>
                <div className={styles.userInfo}>
                  <h4 className={styles.userName}>User 1</h4>
                  <div className={styles.ratingStars}>★★★★★</div>
                </div>
              </div>
              <p className={styles.reviewText}>
                &quot;Kursus yang sangat membantu untuk pemula seperti saya. Penjelasannya mudah dipahami!&quot;
              </p>
            </div>
            
            <div className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.userAvatar}>
                  <span className={styles.avatarText}>U2</span>
                </div>
                <div className={styles.userInfo}>
                  <h4 className={styles.userName}>User 2</h4>
                  <div className={styles.ratingStars}>★★★★☆</div>
                </div>
              </div>
              <p className={styles.reviewText}>
                &quot;Materi yang disajikan sangat relevan dengan kebutuhan industri saat ini. Recommended!&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Kelola Produk */}
        <div className={styles.equalCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Kelola Produk</h3>
            <Link href="/admin/produk" className={styles.addButton}>
              + Tambah Produk
            </Link>
          </div>
          <div className={styles.manageProductsList}>
            <div className={styles.manageItem}>
              <div className={styles.manageIcon}>📚</div>
              <div className={styles.manageInfo}>
                <h4 className={styles.manageName}>Kursus Pemrograman Dasar</h4>
                <p className={styles.manageStats}>12 Pelajaran • 150 Siswa</p>
                <div className={styles.manageActions}>
                  <button className={styles.editBtn}>Edit</button>
                  <button className={styles.deleteBtn}>Hapus</button>
                </div>
              </div>
            </div>
            
            <div className={styles.manageItem}>
              <div className={styles.manageIcon}>🌐</div>
              <div className={styles.manageInfo}>
                <h4 className={styles.manageName}>Kursus Web Development</h4>
                <p className={styles.manageStats}>20 Pelajaran • 89 Siswa</p>
                <div className={styles.manageActions}>
                  <button className={styles.editBtn}>Edit</button>
                  <button className={styles.deleteBtn}>Hapus</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}