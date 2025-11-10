// src/components/product/ProductList.tsx
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Asumsikan tipe ini ada di file terpusat, misal `types/index.ts`
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
    return (
      <p className="text-center text-gray-400">
        Belum ada kursus yang ditambahkan.
      </p>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center">Daftar Kursus</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ scale: 1.02 }}
            className="bg-black/40 border border-gray-700 rounded-2xl p-5 space-y-3 flex flex-col"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/admin/produk/${p._id}`)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p._id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Hapus
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-sm flex-grow">{p.shortDesc}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
}