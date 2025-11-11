// src/components/product/ProductList.tsx
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "@/styles/kaming.module.css"; // Impor

interface Video {
  idPelajaran?: string;
  _id?: string;
  namaPelajaran: string;
  kodePelajaran: string;
}

interface Product {
  _id: string;
  name: string;
  shortDesc: string;
  desc: string;
  video: Video[];
}

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onDelete }: ProductListProps) {
  const router = useRouter();

  if (products.length === 0) {
    return <p className={styles.emptyListText}>Belum ada kursus yang ditambahkan.</p>;
  }

  return (
    <>
      <h2 className={styles.listTitle}>Daftar Kursus</h2>
      <div className={styles.productGrid}>
        {products.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ scale: 1.02 }}
            className={styles.productCard}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{p.name}</h3>
              <div className={styles.cardActions}>
                <button
                  onClick={() => router.push(`/admin/produk/${p._id}`)}
                  className={styles.cardEditButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p._id)}
                  className={styles.cardDeleteButton}
                >
                  Hapus
                </button>
              </div>
            </div>
            <p className={styles.cardDescription}>{p.shortDesc}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
}